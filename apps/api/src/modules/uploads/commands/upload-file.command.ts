export class UploadFileCommand {
  constructor(
    public readonly organizationId: string,
    public readonly userId: string,
    public readonly file?: {
      buffer: Buffer
      originalname: string
      mimetype: string
      size: number
    }
  ) {}
}
