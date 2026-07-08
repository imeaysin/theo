import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  NotFoundException,
} from "@nestjs/common"
import type { ApiErrorCode } from "@workspace/contracts"

type HttpExceptionCtor = new (
  message: string,
  options?: { cause?: unknown }
) => HttpException

function throwWithCode(
  Exception: HttpExceptionCtor,
  message: string,
  code: ApiErrorCode
): never {
  throw new Exception(message, { cause: code })
}

export function apiBadRequest(message: string, code: ApiErrorCode): never {
  throwWithCode(BadRequestException, message, code)
}

export function apiForbidden(message: string, code: ApiErrorCode): never {
  throwWithCode(ForbiddenException, message, code)
}

export function apiNotFound(message: string, code: ApiErrorCode): never {
  throwWithCode(NotFoundException, message, code)
}

export function apiConflict(message: string, code: ApiErrorCode): never {
  throwWithCode(ConflictException, message, code)
}
