import { NoteResponse, NoteResponseSchema } from "@workspace/contracts"
import type { NoteEntity } from "../entities/note.entity"

export function toNoteResponse(entity: NoteEntity): NoteResponse {
  return NoteResponseSchema.parse({
    id: entity.id,
    userId: entity.userId,
    title: entity.title,
    body: entity.body,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  })
}
