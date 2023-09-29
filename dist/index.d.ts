export declare enum TaskType {
    loadFFmeg = 0,
    parseM3u8 = 1,
    downloadTs = 2,
    mergeTs = 3
}
interface ProgressCallback {
    (type: TaskType, progress: number): void;
}
interface ErrorCallback {
    (error: any): void;
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
};
export interface M3u8Parsed {
    url: string;
    content: string;
}
declare class Hls2Mp4 {
    private ffmpeg;
    private maxRetry;
    private loadRetryTime;
    private onProgress?;
    private onError?;
    private tsDownloadConcurrency;
    private totalSegments;
    private savedSegments;
    static version: string;
    static TaskType: typeof TaskType;
    constructor({ maxRetry, tsDownloadConcurrency }: Hls2Mp4Options, onProgress?: ProgressCallback, onError?: ErrorCallback);
    private transformBuffer;
    private hexToUint8Array;
    private aesDecrypt;
    static parseM3u8File(url: string, customFetch?: (url: string) => Promise<string>): Promise<M3u8Parsed>;
    private parseM3u8;
    private downloadFile;
    private downloadSegments;
    private downloadM3u8;
    private loopLoadFile;
    private loadFFmpeg;
    download(url: string): Promise<import("@ffmpeg/ffmpeg/dist/esm/types").FileData | null>;
    saveToFile(buffer: ArrayBuffer | string, filename: string): void;
}
export default Hls2Mp4;
