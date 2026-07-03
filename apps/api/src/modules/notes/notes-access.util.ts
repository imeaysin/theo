import { DomainErrorCode } from "@workspace/contracts"
import {
  apiForbidden,
  apiNotFound,
} from "../../common/exceptions/api.exception"
import type { NoteEntity } from "./entities/note.entity"

/** When a scoped mutation misses, distinguish 404 (missing/wrong org) from 403 (wrong user). */
export function assertNoteAccessOrThrow(
  existing: NoteEntity | null,
  organizationId: string,
  forbiddenMessage: string
): never {
  if (!existing || existing.organizationId !== organizationId) {
    apiNotFound("Note not found", DomainErrorCode.NOTE_NOT_FOUND)
  }
  apiForbidden(forbiddenMessage, DomainErrorCode.NOTE_FORBIDDEN)
}
