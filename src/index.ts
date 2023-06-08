import Transmuxer from './muxer/mp4-transmuxer';
import aesjs, { type ByteSource } from 'aes-js';
import { fetchFile } from './util/http'

enum TaskType {
    loadFFmeg = 0,
    parseM3u8 = 1,
    downloadTs = 2,
    mergeTs = 3
}

interface ProgressCallback {
    (type: TaskType, progress: number): void
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
}

type Segment = {
    index: number;
    url: string;
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

class Hls2Mp4 {

    private maxRetry: number;
    private loadRetryTime = 0;
    private onProgress?: ProgressCallback;
    private tsDownloadConcurrency: number;
    private totalSegments = 0;
    private duration = 0;
    private savedSegments = new Map<number, Uint8Array>()
    public static version = '2.0';
    public static TaskType = TaskType;

    constructor({ maxRetry = 3, tsDownloadConcurrency = 10 }: Hls2Mp4Options, onProgress?: ProgressCallback) {
        this.maxRetry = maxRetry;
        this.onProgress = onProgress;
        this.tsDownloadConcurrency = tsDownloadConcurrency;
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
        const matchedM3u8 = playList.match(
            createFileUrlRegExp('m3u8', 'i')
        )
        if (matchedM3u8) {
            const parsedUrl = parseUrl(url, matchedM3u8[0])
            return this.parseM3u8File(parsedUrl, customFetch)
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
            segs.map(async ({ index, url }) => {
                const tsData = await this.downloadFile(url)
                const buffer = key ? this.aesDecrypt(tsData!, key, iv) : this.transformBuffer(tsData!)
                this.savedSegments.set(index, buffer)
                this.onProgress?.(TaskType.downloadTs, this.savedSegments.size / this.totalSegments)
            })
        )
    }

    private computeTotalDuration(content: string) {
        let duration = 0;
        const tags = content.match(/#EXTINF:\d+(.\d+)?/gi)
        tags?.forEach(
            tag => {
                const dur = tag.match(/\d+(.\d+)?/)
                if (dur) {
                    duration += Number(dur[0]);
                }
            }
        )
        return duration;
    }

    private async downloadM3u8(url: string) {
        const m3u8Parsed = await this.parseM3u8(url)
        let { content, url: parsedUrl } = m3u8Parsed!;
        const keyMatchRegExp = createFileUrlRegExp('key', 'gi');
        const keyTagMatchRegExp = new RegExp(
            '#EXT-X-KEY:METHOD=(AES-128|NONE)(,URI="' + keyMatchRegExp.source + '"(,IV=\\w+)?)?',
            'gi'
        )
        const matchReg = new RegExp(
            keyTagMatchRegExp.source + '|' + createFileUrlRegExp('ts', 'gi').source,
            'g'
        )
        const matches = content.match(matchReg)
        if (!matches) {
            throw new Error('Invalid m3u8 file, no ts file found')
        }

        this.duration = this.computeTotalDuration(content)

        const segments: SegmentGroup[] = []
        for (let i = 0; i < matches.length; i++) {
            const matched = matches[i]
            if (matched.match(/#EXT-X-KEY/)) {
                const matchedKey = matched.match(keyMatchRegExp)
                const matchedIV = matched.match(/(?<=IV=)\w+$/)
                segments.push({
                    key: matchedKey?.[0],
                    iv: matchedIV?.[0],
                    segments: []
                })
            }
            else if (i === 0) {
                segments.push({
                    segments: [matched]
                })
            }
            else {
                segments[segments.length - 1].segments.push(matched)
            }
        }

        this.totalSegments = segments.reduce((prev, current) => prev + current.segments.length, 0);
        const batch = this.tsDownloadConcurrency;
        let treatedSegments = 0;

        for (const group of segments) {
            const total = group.segments.length;
            let keyBuffer: Uint8Array | undefined;

            if (group.key) {
                const keyUrl = parseUrl(parsedUrl, group.key)
                keyBuffer = await this.downloadFile(keyUrl)
            }

            for (let i = 0; i <= Math.floor((total / batch)); i++) {

                await this.downloadSegments(
                    group.segments.slice(
                        i * batch,
                        Math.min(total, (i + 1) * batch)
                    ).map<Segment>(
                        (seg, j) => {
                            const url = parseUrl(parsedUrl, seg)
                            return {
                                index: treatedSegments + i * batch + j,
                                url
                            }
                        }
                    ),
                    keyBuffer,
                    group.iv
                )
            }
            treatedSegments += total;
        }
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

    private mergeDataArray(data: Uint8Array[]) {

        const totalByteLength = data.reduce(
            (prev, current) => prev + current.byteLength,
            0
        )
        const dataArray = new Uint8Array(totalByteLength)
        let byteOffset = 0;

        for (const part of data) {
            dataArray.set(part, byteOffset)
            byteOffset += part.byteLength
        }

        return dataArray
    }

    private async transmuxerSegments() {

        this.onProgress?.(TaskType.mergeTs, 0);

        const transmuxer = new Transmuxer({
            duration: this.duration
        })

        const transmuxerFirstSegment = (data: Uint8Array) => {
            return new Promise<Uint8Array>(
                (resolve) => {
                    transmuxer.on('data', (segment) => {
                        const data = new Uint8Array(segment.initSegment.byteLength + segment.data.byteLength);
                        data.set(segment.initSegment, 0);
                        data.set(segment.data, segment.initSegment.byteLength);
                        resolve(data);
                    })
                    transmuxer.push(data)
                    transmuxer.flush()
                }
            )
        }

        const transmuxerSegment = (buffer: Uint8Array) => {
            return new Promise<Uint8Array>(
                (resolve) => {
                    transmuxer.off('data')
                    transmuxer.on('data', (segment) => resolve(segment.data))
                    transmuxer.push(buffer)
                    transmuxer.flush()
                }
            )
        }

        let chunks: Uint8Array[] = []

        for (let i = 0; i < this.savedSegments.size; i++) {

            const segment = this.savedSegments.get(i)
            let chunk: Uint8Array;

            if (i === 0) {
                chunk = await transmuxerFirstSegment(segment!)
            }
            else {
                chunk = await transmuxerSegment(segment!)
            }
            chunks.push(chunk);
        }

        const data = this.mergeDataArray(chunks)

        this.onProgress?.(TaskType.mergeTs, 1);

        return data;
    }

    public async download(url: string) {
        await this.downloadM3u8(url);
        const data = await this.transmuxerSegments()
        return data;
    }

    public saveToFile(buffer: ArrayBufferLike, filename: string) {
        const objectUrl = URL.createObjectURL(new Blob([buffer], { type: 'video/mp4' }));
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = filename;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
    }
}

export default Hls2Mp4;
