import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrorDto } from '@src/common/dto/api-error.dto';

export function ApiCommonResponses() {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Validation failed', type: ApiErrorDto }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid session',
      type: ApiErrorDto,
    }),
    ApiForbiddenResponse({
      description: 'Insufficient permissions',
      type: ApiErrorDto,
    }),
    ApiNotFoundResponse({ description: 'Resource not found', type: ApiErrorDto }),
  );
}
