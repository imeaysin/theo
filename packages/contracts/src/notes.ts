import { z } from "zod"

export const NoteResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateNoteSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().max(5000).optional().default(""),
})

export const NotesListResponseSchema = z.object({
  items: z.array(NoteResponseSchema),
})

export type NoteResponse = z.infer<typeof NoteResponseSchema>
export type CreateNoteInput = z.infer<typeof CreateNoteSchema>
export type NotesListResponse = z.infer<typeof NotesListResponseSchema>
