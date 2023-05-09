import { CreateFFmpegOptions } from '@ffmpeg/ffmpeg';
export declare enum TaskType {
    loadFFmeg = 0,
    parseM3u8 = 1,
    downloadTs = 2,
    mergeTs = 3
}
interface ProgressCallback {
    (type: TaskType, progress: number): void;
}
export interface M3u8Parsed {
    url: string;
    content: string;
}
export declare function parseM3u8File(url: string): Promise<M3u8Parsed>;
export default class Hls2Mp4 {
    private instance;
    onProgress?: ProgressCallback;
    constructor(options: CreateFFmpegOptions, onProgress?: ProgressCallback);
    private downloadM3u8;
    download(url: string): Promise<ArrayBufferLike>;
    saveToFile(buffer: ArrayBufferLike, filename: string): void;
}
export {};
