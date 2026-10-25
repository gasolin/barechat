declare module 'hypercore-crypto' {
  export function hash(data: Buffer): Buffer;
  export function keyPair(): { publicKey: Buffer; secretKey: Buffer };
  export function randomBytes(size: number): Buffer;
}

declare module 'b4a' {
  export function from(data: string): Buffer;
  export function toString(buffer: Buffer, encoding?: string): string;
  export function concat(buffers: Buffer[]): Buffer;
  export function compare(a: Buffer, b: Buffer): number;
  export function equals(a: Buffer, b: Buffer): boolean;
  export function isBuffer(obj: any): boolean;
}

declare module 'hyperswarm' {
  export default class Hyperswarm {
    constructor(options?: any);
    join(topic: Buffer, options?: any): any;
    leave(topic: Buffer): void;
    destroy(): void;
    on(event: string, callback: (...args: any[]) => void): void;
    connections: any;
  }
}