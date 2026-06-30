import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import {
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common"
import { NotesRepository } from "../repositories/notes.repository"
import { DeleteNoteCommand } from "./delete-note.command"

@CommandHandler(DeleteNoteCommand)
export class DeleteNoteHandler implements ICommandHandler<DeleteNoteCommand> {
  constructor(private readonly notesRepository: NotesRepository) {}

  async execute(command: DeleteNoteCommand): Promise<void> {
    const deleted = await this.notesRepository.deleteByIdForUser(
      command.noteId,
      command.userId
    )
    if (deleted) return

    const existing = await this.notesRepository.findById(command.noteId)
    if (!existing) throw new NotFoundException("Note not found")
    throw new ForbiddenException("Not allowed to delete this note")
  }
}
