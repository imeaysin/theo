import { HttpErrorCode } from "./http.errors"
import { NoteErrorCode } from "./note.errors"
import { FileErrorCode } from "./file.errors"
import { NotificationErrorCode } from "./notification.errors"
export * from "./http.errors"
export * from "./note.errors"
export * from "./file.errors"
export * from "./notification.errors"
export type DomainErrorCode =
  NoteErrorCode | FileErrorCode | NotificationErrorCode

export type ApiErrorCode = HttpErrorCode | DomainErrorCode

const API_ERROR_CODES = new Set<string>([
  ...Object.values(HttpErrorCode),
  ...Object.values(NoteErrorCode),
  ...Object.values(FileErrorCode),
  ...Object.values(NotificationErrorCode),
])

export function isApiErrorCode(value: string): value is ApiErrorCode {
  return API_ERROR_CODES.has(value)
}
