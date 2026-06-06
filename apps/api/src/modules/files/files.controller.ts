import { randomUUID } from 'node:crypto';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { STORAGE } from '@src/modules/storage/storage.module';
import type { StorageProvider } from '@workspace/storage';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'application/pdf',
];

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(@Inject(STORAGE) private readonly storage: StorageProvider) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (max 10MB)',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported file type: ${file.mimetype}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `uploads/${randomUUID()}-${sanitized}`;

    const result = await this.storage.upload({
      path,
      body: file.buffer,
      contentType: file.mimetype,
      contentLength: file.size,
    });

    return { url: result.url, path: result.path };
  }
}
