import { createFFmpeg, fetchFile, CreateFFmpegOptions, FFmpeg } from '@ffmpeg/ffmpeg';

export enum TaskType {
    parseM3u8 = 0,
    downloadTs = 1,
    mergeTs = 2
}

interface ProgressCallback {
    (type: TaskType, progress: number): void
}

export default class Hls2Mp4 {

    private instance: FFmpeg;
    public onProgress?: ProgressCallback;

    constructor(options: CreateFFmpegOptions, onProgress?: ProgressCallback) {
        this.instance = createFFmpeg(options);
        this.onProgress = onProgress;
    }

    private parseUrl(url: string, path: string) {
        if (path.startsWith('http')) {
            return path;
        }
        const uri = new URL(url);
        if (path.startsWith('/')) {
            return uri.origin + path;
        }
        return uri.origin + uri.pathname.replace(/[^\/]+$/, '') + path;
    }

    private async parseM3u8File(url: string): Promise<string> {
        const playList = await fetchFile(url).then(
            data => new Blob([data.buffer]).text()
        )
        const matchedM3u8 = playList.match(/(https?:\/\/)?[a-zA-Z\d_:\.\-\/]+?\.m3u8/i)
        if (matchedM3u8) {
            const parsedUrl = this.parseUrl(url, matchedM3u8[0])
            return this.parseM3u8File(parsedUrl);
        }
        return playList;
    }

    private async downloadM3u8(url: string) {
        this.onProgress?.(TaskType.parseM3u8, 0)
        let m3u8Parsed = await this.parseM3u8File(url)
        this.onProgress?.(TaskType.parseM3u8, 1)
        const segs = m3u8Parsed.match(/(https?:\/\/)?[a-zA-Z\d_\.\-\/]+?\.ts/gi)
        for (let i = 0; i < segs.length; i++) {
            const parsedUrl = this.parseUrl(url, segs[i])
            const segName = `seg-${i}.ts`;
            this.instance.FS('writeFile', segName, await fetchFile(parsedUrl));
            this.onProgress?.(TaskType.downloadTs, (i + 1) / segs.length)
            m3u8Parsed = m3u8Parsed.replace(segs[i], segName)
        }
        const m3u8 = 'temp.m3u8';
        this.instance.FS('writeFile', m3u8, m3u8Parsed);
        return m3u8;
    }

    public async download(url: string) {
        this.onProgress?.(TaskType.mergeTs, 0);
        await this.instance.load();
        const m3u8 = await this.downloadM3u8(url);
        await this.instance.run('-i', m3u8, '-c', 'copy', 'temp.mp4', '-loglevel', 'debug');
        const data = this.instance.FS('readFile', 'temp.mp4');
        this.instance.exit();
        this.onProgress?.(TaskType.mergeTs, 1);
        return data.buffer;
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
