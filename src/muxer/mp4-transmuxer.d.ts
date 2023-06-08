
interface TransmuxerOptions {
    duration: number;
}

interface TransmuxeSegment {
    initSegment: Uint8Array;
    data: Uint8Array;
}

interface transmuxerDataListener {
    (data: TransmuxeSegment): void;
}

export default class Transmuxer {

    constructor(options: TransmuxerOptions) { }

    on(event: 'data', listener: transmuxerDataListener): void;
    off(event: string): void;

    push(data: Uint8Array): void;
    flush(): void;
}

