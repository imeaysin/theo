import { NoteResponseSchema, type NoteResponse } from "@workspace/contracts"
import type { NoteEntity } from "../domain/note.model"

export function toNoteResponse(record: NoteEntity): NoteResponse {
  return NoteResponseSchema.parse({
    id: record.id,
    organizationId: record.organizationId,
    userId: record.userId,
    title: record.title,
    body: record.body,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  })
}
