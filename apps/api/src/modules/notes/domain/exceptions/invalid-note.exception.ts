import { DomainException } from "@/common/exceptions/domain.exception"
import { NoteErrorCode } from "@workspace/contracts"

export class InvalidNoteException extends DomainException {
  readonly errorCode = NoteErrorCode.INVALID_CONTENT
  readonly statusCode = 422

  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata)
  }
}
