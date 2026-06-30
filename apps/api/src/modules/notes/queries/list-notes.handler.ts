import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import type { NoteResponse } from "@workspace/contracts"
import { toNoteResponse } from "../dto/note-response.mapper"
import { NotesRepository } from "../repositories/notes.repository"
import { ListNotesQuery } from "./list-notes.query"

@QueryHandler(ListNotesQuery)
export class ListNotesHandler implements IQueryHandler<ListNotesQuery> {
  constructor(private readonly notesRepository: NotesRepository) {}

  async execute(query: ListNotesQuery): Promise<NoteResponse[]> {
    const notes = await this.notesRepository.findByUserId(query.userId)
    return notes.map(toNoteResponse)
  }
}
