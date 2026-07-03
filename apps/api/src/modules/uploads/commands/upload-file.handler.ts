import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UploadResponseSchema, type UploadResponse } from "@workspace/contracts"
import { DomainErrorCode } from "@workspace/contracts"
import { randomUUID } from "node:crypto"
import { apiBadRequest } from "../../../common/exceptions/api.exception"
import { StorageRepository } from "../repositories/storage.repository"
import { UploadFileCommand } from "./upload-file.command"

@CommandHandler(UploadFileCommand)
export class UploadFileHandler implements ICommandHandler<UploadFileCommand> {
  constructor(private readonly storageRepository: StorageRepository) {}

  async execute(command: UploadFileCommand): Promise<UploadResponse> {
    const { organizationId, userId, file } = command
    if (!file?.buffer?.length) {
      apiBadRequest("File is required", DomainErrorCode.FILE_REQUIRED)
    }

    const safeName = file.originalname.replace(/[^\w.-]+/g, "_").slice(0, 120)
    const path = `${organizationId}/${userId}/${randomUUID()}-${safeName}`

    const result = await this.storageRepository.upload({
      path,
      body: file.buffer,
      contentType: file.mimetype || "application/octet-stream",
      contentLength: file.size,
    })

    return UploadResponseSchema.parse(result)
  }
}
