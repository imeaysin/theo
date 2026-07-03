/** Default codes derived from HTTP status when no domain code is set. */
export const HttpErrorCode = {
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  HTTP_ERROR: "HTTP_ERROR",
} as const

/** Stable business error tokens for domain logic. */
export const DomainErrorCode = {
  NOTE_NOT_FOUND: "NOTE_NOT_FOUND",
  NOTE_FORBIDDEN: "NOTE_FORBIDDEN",
  FILE_REQUIRED: "FILE_REQUIRED",
  INVALID_FILE_PATH: "INVALID_FILE_PATH",
  FILE_NOT_FOUND: "FILE_NOT_FOUND",
  NOTIFICATION_NOT_FOUND: "NOTIFICATION_NOT_FOUND",
  INVALID_PUSH_TOKEN: "INVALID_PUSH_TOKEN",
} as const

export type HttpErrorCode = (typeof HttpErrorCode)[keyof typeof HttpErrorCode]
export type DomainErrorCode =
  (typeof DomainErrorCode)[keyof typeof DomainErrorCode]
export type ApiErrorCode = HttpErrorCode | DomainErrorCode

const API_ERROR_CODES = new Set<string>([
  ...Object.values(HttpErrorCode),
  ...Object.values(DomainErrorCode),
])

export function isApiErrorCode(value: string): value is ApiErrorCode {
  return API_ERROR_CODES.has(value)
}
