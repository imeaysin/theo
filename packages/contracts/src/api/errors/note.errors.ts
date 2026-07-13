export const NoteErrorCode = {
  NOT_FOUND: "NOTE.NOT_FOUND",
  FORBIDDEN: "NOTE.FORBIDDEN",
  INVALID_CONTENT: "NOTE.INVALID_CONTENT",
} as const

export type NoteErrorCode = (typeof NoteErrorCode)[keyof typeof NoteErrorCode]
