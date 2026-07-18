import type { NoteResponse } from "@workspace/contracts"

export function matchesNoteSearch(note: NoteResponse, query: string) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  return (
    note.title.toLowerCase().includes(normalized) ||
    note.body.toLowerCase().includes(normalized)
  )
}
