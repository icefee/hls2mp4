declare enum TaskType {
    parseM3u8 = 0,
    downloadTs = 1,
    mergeTs = 2
}
export interface ProgressCallback {
    (type: TaskType, progress: number): void;
}
export type OutputType = 'mp4' | 'ts';
export type Hls2Mp4Options = {
    /**
     * max retry times while request data failed, default: 3
     */
    maxRetry?: number;
    /**
     * the concurrency for download ts segment, default: 10
     */
    tsDownloadConcurrency?: number;
    /**
     * the type of output file, can be mp4 or ts, default: mp4
     */
    outputType?: OutputType;
};
export interface M3u8Parsed {
    url: string;
    content: string;
}
declare class Hls2Mp4 {
    private maxRetry;
    private loadRetryTime;
    private outputType;
    private onProgress?;
    private tsDownloadConcurrency;
    private totalSegments;
    private duration;
    private savedSegments;
    static version: string;
    static TaskType: typeof TaskType;
    constructor({ maxRetry, tsDownloadConcurrency, outputType }: Hls2Mp4Options, onProgress?: ProgressCallback);
    private transformBuffer;
    private hexToUint8Array;
    private aesDecrypt;
    static parseM3u8File(url: string, customFetch?: (url: string) => Promise<string>): Promise<M3u8Parsed>;
    private parseM3u8;
    private downloadFile;
    private downloadSegments;
    private computeTotalDuration;
    private downloadM3u8;
    private loopLoadFile;
    private mergeDataArray;
    private loopSegments;
    private transmuxerSegments;
    download(url: string): Promise<Uint8Array>;
    saveToFile(buffer: ArrayBufferLike, filename: string): void;
}
export default Hls2Mp4;
