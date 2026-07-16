import { Injectable } from "@nestjs/common"
import {
  UPLOAD_MAX_BYTES,
  UploadResponseSchema,
  type UploadResponse,
} from "@workspace/contracts"
import { UploadCommandRepository, type UploadUserFileInput } from "./repository"
import { UploadBadRequestException } from "./domain/exceptions"

@Injectable()
export class UploadsService {
  constructor(private readonly uploadRepo: UploadCommandRepository) {}

  async uploadFile(input: UploadUserFileInput): Promise<UploadResponse> {
    if (!input.file?.buffer?.length) {
      throw new UploadBadRequestException("File is required")
    }

    if (input.file.size > UPLOAD_MAX_BYTES) {
      throw new UploadBadRequestException("File too large")
    }

    const result = await this.uploadRepo.uploadUserFile(input)
    return UploadResponseSchema.parse(result)
  }
}
