declare module "gif.js" {
  interface GifOptions {
    workers?: number
    quality?: number
    workerScript?: string
    width?: number
    height?: number
    dither?: string | boolean
  }

  interface GifFrameOptions {
    delay?: number
    copy?: boolean
  }

  export default class GIF {
    constructor(options?: GifOptions)
    addFrame(
      frame: CanvasImageSource | CanvasRenderingContext2D,
      options?: GifFrameOptions
    ): void
    on(event: "finished", callback: (blob: Blob) => void): void
    on(event: "progress", callback: (progress: number) => void): void
    render(): void
    abort(): void
  }
}
