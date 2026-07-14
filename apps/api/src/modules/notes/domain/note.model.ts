export type NoteEntity = {
  id: string
  organizationId: string
  userId: string
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
}

export type NewNoteEntity = Pick<
  NoteEntity,
  "organizationId" | "userId" | "title" | "body"
>

export type NoteActorScope = {
  organizationId: string
  userId: string
}

export type NoteMutationScope = NoteActorScope & {
  noteId: string
}

export type BulkNoteMutationScope = NoteActorScope & {
  ids: string[]
}
