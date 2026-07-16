import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger"
import { UPLOAD_MAX_BYTES } from "@workspace/contracts"
import {
  MemberHasPermission,
  Session,
  type UserSession,
} from "@/common/decorators"
import { ApiAuthErrorResponses } from "@/common/decorators/api-error-responses.decorator"
import { requireActiveOrganizationId } from "@/common/session-context"
import { UploadsService } from "./uploads.service"
import { UploadBadRequestException } from "./domain/exceptions"
import { UploadApiResponseDto, type FileMetadata } from "./dto"

@ApiTags("uploads")
@ApiAuthErrorResponses()
@Controller({ path: "uploads", version: "1" })
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @MemberHasPermission({ permissions: { project: ["create"] } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Upload a file" })
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
    FileInterceptor("file", {
      limits: { fileSize: UPLOAD_MAX_BYTES, files: 1 },
    })
  )
  upload(@Session() session: UserSession, @UploadedFile() file?: FileMetadata) {
    if (!file) {
      throw new UploadBadRequestException("File is required")
    }
    return this.uploadsService.uploadFile({
      organizationId: requireActiveOrganizationId(session),
      userId: session.user.id,
      file,
    })
  }
}
