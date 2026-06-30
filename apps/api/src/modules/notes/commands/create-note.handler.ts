import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import type { NoteResponse } from "@workspace/contracts"
import { toNoteResponse } from "../dto/note-response.mapper"
import { NotesRepository } from "../repositories/notes.repository"
import { CreateNoteCommand } from "./create-note.command"

@CommandHandler(CreateNoteCommand)
export class CreateNoteHandler implements ICommandHandler<CreateNoteCommand> {
  constructor(private readonly notesRepository: NotesRepository) {}

  async execute(command: CreateNoteCommand): Promise<NoteResponse> {
    const note = await this.notesRepository.insert({
      userId: command.userId,
      title: command.input.title,
      body: command.input.body,
    })
    return toNoteResponse(note)
  }
}
