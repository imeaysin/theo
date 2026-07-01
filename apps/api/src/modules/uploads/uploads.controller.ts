import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { FileInterceptor } from "@nestjs/platform-express"
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger"
import type { JwtClaims } from "@workspace/auth/types"
import { DomainErrorCode } from "@workspace/contracts"
import { CurrentUser } from "../../common/decorators"
import { ApiAuthErrorResponses } from "../../common/decorators/api-error-responses.decorator"
import { apiBadRequest } from "../../common/exceptions/api.exception"
import { UploadFileCommand } from "./commands/upload-file.command"
import { UploadApiResponseDto } from "./uploads.dto"

const MAX_BYTES = 5 * 1024 * 1024

@ApiTags("uploads")
@ApiAuthErrorResponses()
@Controller({ path: "uploads", version: "1" })
export class UploadsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Upload a file",
    description: "Uploads a single file (max 5 MB) for the authenticated user.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Multipart upload with a single `file` field.",
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "File to upload (max 5 MB)",
        },
      },
      required: ["file"],
    },
  })
  @ApiCreatedResponse({ type: UploadApiResponseDto })
  @UseInterceptors(
    FileInterceptor("file", { limits: { fileSize: MAX_BYTES, files: 1 } })
  )
  upload(
    @CurrentUser() user: JwtClaims,
    @UploadedFile()
    file?: {
      buffer: Buffer
      originalname: string
      mimetype: string
      size: number
    }
  ) {
    const uploaded = file?.buffer?.length ? file : undefined
    if (!uploaded) {
      apiBadRequest("File is required", DomainErrorCode.FILE_REQUIRED)
    }

    return this.commandBus.execute(new UploadFileCommand(user.id, uploaded))
  }
}
