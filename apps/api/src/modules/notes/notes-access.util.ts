import { NoteNotFoundException } from "./domain/exceptions/note-not-found.exception"
import type { NoteEntity } from "./domain/note.model"

/** Cross-tenant and missing notes both 404 — do not leak existence across orgs. */
export function assertNoteAccessOrThrow(
  existing: NoteEntity | null,
  organizationId: string
): void {
  if (!existing) {
    throw new NoteNotFoundException("Note not found")
  }

  if (existing.organizationId !== organizationId) {
    throw new NoteNotFoundException("Note not found")
  }
}
