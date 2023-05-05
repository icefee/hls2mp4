import { CreateFFmpegOptions } from '@ffmpeg/ffmpeg';
export declare enum TaskType {
    parseM3u8 = 0,
    downloadTs = 1,
    mergeTs = 2
}
interface ProgressCallback {
    (type: TaskType, progress: number): void;
}
export default class Hls2Mp4 {
    private instance;
    onProgress?: ProgressCallback;
    constructor(options: CreateFFmpegOptions, onProgress?: ProgressCallback);
    private parseUrl;
    private parseM3u8File;
    private downloadM3u8;
    download(url: string): Promise<ArrayBufferLike>;
    saveToFile(buffer: ArrayBufferLike, filename: string): void;
}
export {};
