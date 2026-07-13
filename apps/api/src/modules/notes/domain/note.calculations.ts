import { InvalidNoteException } from "./exceptions"

export function validateNoteContent(title: string, body: string): void {
  if (title.trim().length === 0) {
    throw new InvalidNoteException("Note title cannot be completely empty.", {
      field: "title",
    })
  }

  if (!/[a-zA-Z]/.test(title)) {
    throw new InvalidNoteException(
      "Note title must contain at least one letter.",
      { title }
    )
  }

  if (body.trim().length === 0) {
    throw new InvalidNoteException("Note body cannot be empty.", {
      field: "body",
    })
  }
}
