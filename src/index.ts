import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import aesjs, { type ByteSource } from 'aes-js'

export enum TaskType {
    loadFFmeg = 0,
    parseM3u8 = 1,
    downloadTs = 2,
    mergeTs = 3
}

interface ProgressCallback {
    (type: TaskType, progress: number): void
}

interface ErrorCallback {
    (error: any): void
}

type LoadResult<T = unknown> = {
    done: boolean;
    data?: T;
    msg?: string;
}

type Hls2Mp4Options = {
    /**
     * max retry times while request data failed
     */
    maxRetry?: number;
    /**
     * the concurrency for download ts
     */
    tsDownloadConcurrency?: number;
    /**
     * the base url of ffmpeg default: https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd
     */
    ffmpegBaseUrl?: string;
}

type Segment = {
    source: string;
    url: string;
    name: string;
}

export interface M3u8Parsed {
    url: string;
    content: string;
}

type SegmentGroup = {
    key?: string;
    iv?: string;
    segments: string[];
}

function createFileUrlRegExp(ext: string, flags?: string) {
    return new RegExp('(https?://)?[\\w:\\.\\-\\/]+?\\.' + ext, flags)
}

function parseUrl(url: string, path: string) {
    if (path.startsWith('http')) {
        return path;
    }
    return new URL(path, url).href;
}

const ffmpegDefaultBaseUrl = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'

class Hls2Mp4 {

    private ffmpeg: FFmpeg;
    private maxRetry: number;
    private ffmpegBaseUrl!: string;
    private loadRetryTime = 0;
    private onProgress?: ProgressCallback;
    private onError?: ErrorCallback;
    private tsDownloadConcurrency: number;
    private totalSegments = 0;
    private savedSegments = 0;
    public static version = '1.2.7';
    public static TaskType = TaskType;

    constructor(
        {
            maxRetry = 3,
            tsDownloadConcurrency = 10,
            ffmpegBaseUrl = ffmpegDefaultBaseUrl
        }: Hls2Mp4Options,
        onProgress?: ProgressCallback,
        onError?: ErrorCallback
    ) {
        this.ffmpeg = new FFmpeg();
        this.maxRetry = maxRetry;
        this.tsDownloadConcurrency = tsDownloadConcurrency;
        this.ffmpegBaseUrl = ffmpegBaseUrl;
        this.onProgress = onProgress;
        this.onError = onError;
    }

    private transformBuffer(buffer: Uint8Array) {
        if (buffer[0] === 0x47) {
            return buffer;
        }
        let bufferOffset = 0;
        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] === 0x47 && buffer[i + 1] === 0x40) {
                bufferOffset = i;
                break;
            }
        }
        return buffer.slice(bufferOffset)
    }

    private hexToUint8Array(hex: string) {
        const matchedChars = hex.replace(/^0x/, '').match(
            /[\da-f]{2}/gi
        );
        if (matchedChars) {
            return new Uint8Array(
                matchedChars.map(hx => parseInt(hx, 16))
            )
        }
        return new Uint8Array(0);
    }

    private aesDecrypt(buffer: Uint8Array, keyBuffer: Uint8Array, iv?: string) {
        let ivData: ByteSource;
        if (iv) {
            ivData = iv.startsWith('0x') ? this.hexToUint8Array(iv) : aesjs.utils.utf8.toBytes(iv)
        }
        const aesCbc = new aesjs.ModeOfOperation.cbc(keyBuffer, ivData!);
        return aesCbc.decrypt(buffer);
    }

    public static async parseM3u8File(url: string, customFetch?: (url: string) => Promise<string>): Promise<M3u8Parsed> {
        let playList = '';
        if (customFetch) {
            playList = await customFetch(url)
        }
        else {
            playList = await fetchFile(url).then(
                data => aesjs.utils.utf8.fromBytes(data)
            )
        }
        const streamInfoMatcher = /#EXT-X-STREAM-INF/i
        const streamInfos = playList.match(streamInfoMatcher)
        if (streamInfos) {
            const lines = playList.split(/\n/)
            const bandwidthMatcher = /BANDWIDTH=\d+/i
            let bandwidth = 0, maxBandwidthUrl: string | null = null
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.match(streamInfoMatcher)) {
                    const currentBandwidth = Number(
                        line.match(bandwidthMatcher)?.[0]?.match(/\d+/)?.[0]
                    )
                    if (currentBandwidth > bandwidth) {
                        maxBandwidthUrl = lines[i + 1]
                        bandwidth = currentBandwidth
                    }
                }
            }
            if (maxBandwidthUrl) {
                return this.parseM3u8File(
                    parseUrl(url, maxBandwidthUrl),
                    customFetch
                )
            }
        }
        else {
            const matcher = createFileUrlRegExp('m3u8', 'i')
            const matched = playList.match(matcher)
            if (matched) {
                const parsedUrl = parseUrl(url, matched[0])
                return this.parseM3u8File(parsedUrl, customFetch)
            }
        }
        return {
            url,
            content: playList
        }
    }

    private async parseM3u8(url: string) {
        this.onProgress?.(TaskType.parseM3u8, 0)
        const { done, data } = await this.loopLoadFile<M3u8Parsed>(
            () => Hls2Mp4.parseM3u8File(url)
        )
        if (done) {
            this.onProgress?.(TaskType.parseM3u8, 1)
            return data;
        }
        throw new Error('m3u8 load failed')
    }

    private async downloadFile(url: string) {
        const { done, data } = await this.loopLoadFile<Uint8Array>(
            () => fetchFile(url)
        )
        if (done) {
            return data;
        }
        const fileName = url.match(/\w+\.\w{2,3}$/i)?.[0]
        throw new Error(`load file ${fileName} error after retry ${this.maxRetry} times.`)
    }

    private async downloadSegments(segs: Segment[], key?: Uint8Array, iv?: string) {
        return Promise.all(
            segs.map(async ({ name, url, source }) => {
                const tsData = await this.downloadFile(url)
                const buffer = key ? this.aesDecrypt(tsData!, key, iv) : this.transformBuffer(tsData!)
                this.ffmpeg.writeFile(name, buffer)
                this.savedSegments += 1
                this.onProgress?.(TaskType.downloadTs, this.savedSegments / this.totalSegments)
                return {
                    source,
                    url,
                    name
                }
            })
        )
    }

    private async downloadM3u8(url: string) {
        const m3u8Parsed = await this.parseM3u8(url)
        let { content, url: parsedUrl } = m3u8Parsed!;
        const keyTagMatchRegExp = new RegExp(
            '#EXT-X-KEY:METHOD=(AES-128|NONE)(,URI="[^"]+"(,IV=\\w+)?)?',
            'gi'
        )
        const extMatchRegExp = new RegExp('#EXTINF:\\d+(\\.\\d+)?,\\n')
        const matchReg = new RegExp(
            keyTagMatchRegExp.source + '|' + extMatchRegExp.source + '.+',
            'gim'
        )
        const matches = content.match(matchReg)
        if (!matches) {
            throw new Error('Invalid m3u8 file, no ts file found')
        }
        const segments: SegmentGroup[] = []
        for (let i = 0; i < matches.length; i++) {
            const matched = matches[i]
            if (matched.match(/#EXT-X-KEY/)) {
                const matchedKey = matched.match(/(?<=URI=").+(?=")/)?.[0]
                const matchedIV = matched.match(/IV=\w+$/)?.[0]?.replace(/^IV=/, '')
                segments.push({
                    key: matchedKey,
                    iv: matchedIV,
                    segments: []
                })
            }
            else {
                const segment = matched.replace(extMatchRegExp, '')
                if (i === 0) {
                    segments.push({
                        segments: [segment]
                    })
                }
                else {
                    segments[segments.length - 1].segments.push(segment)
                }
            }
        }

        this.totalSegments = segments.reduce(
            (prev, current) => prev + current.segments.length,
            0
        )
        this.savedSegments = 0
        const batch = this.tsDownloadConcurrency
        let treatedSegments = 0

        for (const group of segments) {
            const total = group.segments.length;
            let keyBuffer: Uint8Array | undefined;
            if (group.key) {
                const keyUrl = parseUrl(parsedUrl, group.key)
                keyBuffer = await this.downloadFile(keyUrl)
            }
            for (let i = 0; i <= Math.floor((total / batch)); i++) {
                const downloadSegs = await this.downloadSegments(
                    group.segments.slice(
                        i * batch,
                        Math.min(total, (i + 1) * batch)
                    ).map<Segment>(
                        (seg, j) => {
                            const url = parseUrl(parsedUrl, seg)
                            const name = `seg-${treatedSegments + i * batch + j}.ts`
                            return {
                                source: seg,
                                url,
                                name
                            }
                        }
                    ),
                    keyBuffer,
                    group.iv
                )
                for (const { source, name } of downloadSegs) {
                    content = content.replace(source, name)
                }
            }
            treatedSegments += total;
        }
        content = content.replace(keyTagMatchRegExp, '')
        const m3u8 = 'temp.m3u8'
        this.ffmpeg.writeFile(m3u8, content)
        return m3u8
    }

    private async loopLoadFile<T = undefined>(startLoad: () => PromiseLike<T | undefined>): Promise<LoadResult<T>> {
        try {
            const result = await startLoad();
            this.loadRetryTime = 0;
            return {
                done: true,
                data: result
            }
        }
        catch (err) {
            this.loadRetryTime += 1;
            if (this.loadRetryTime < this.maxRetry) {
                return this.loopLoadFile<T>(startLoad)
            }
            return {
                done: false,
                data: undefined
            }
        }
    }

    private async loadFFmpeg(): Promise<void> {
        this.onProgress?.(TaskType.loadFFmeg, 0)
        const baseUrl = this.ffmpegBaseUrl
        const coreURL = await toBlobURL(`${baseUrl}/ffmpeg-core.js`, 'text/javascript')
        const wasmURL = await toBlobURL(`${baseUrl}/ffmpeg-core.wasm`, 'application/wasm')
        // workerURL = workerURL ?? await toBlobURL(`${baseUrl}/ffmpeg-core.worker.js`, 'text/javascript')
        const loaded = await this.ffmpeg.load({
            coreURL,
            wasmURL
        })
        if (loaded) {
            this.onProgress?.(TaskType.loadFFmeg, 1)
        }
        else {
            return this.loadFFmpeg()
        }
    }

    public async download(url: string) {
        try {
            await this.loadFFmpeg()
            const m3u8 = await this.downloadM3u8(url)
            this.onProgress?.(TaskType.mergeTs, 0)
            await this.ffmpeg.exec(['-i', m3u8, '-c', 'copy', 'temp.mp4', '-loglevel', 'debug'])
            const data = await this.ffmpeg.readFile('temp.mp4')
            this.ffmpeg.terminate()
            this.onProgress?.(TaskType.mergeTs, 1)
            return data
        }
        catch (err) {
            this.ffmpeg.terminate()
            this.onError?.(err)
            return null
        }
    }

    public saveToFile(buffer: ArrayBuffer | string, filename: string) {
        const objectUrl = URL.createObjectURL(
            new Blob([buffer], { type: 'video/mp4' })
        )
        const anchor = document.createElement('a')
        anchor.href = objectUrl
        anchor.download = filename
        anchor.click()
        setTimeout(() => URL.revokeObjectURL(objectUrl), 100)
    }
}

export default Hls2Mp4
