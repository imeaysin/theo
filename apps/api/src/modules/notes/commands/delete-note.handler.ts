import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { NotesRepository } from "../repositories/notes.repository"
import { assertNoteAccessOrThrow } from "../notes-access.util"
import { DeleteNoteCommand } from "./delete-note.command"

@CommandHandler(DeleteNoteCommand)
export class DeleteNoteHandler implements ICommandHandler<DeleteNoteCommand> {
  constructor(private readonly notesRepository: NotesRepository) {}

  async execute(command: DeleteNoteCommand): Promise<void> {
    const deleted = await this.notesRepository.deleteByIdForOrganizationAndUser(
      command.noteId,
      command.organizationId,
      command.userId
    )
    if (deleted) return

    const existing = await this.notesRepository.findById(command.noteId)
    assertNoteAccessOrThrow(
      existing,
      command.organizationId,
      "Not allowed to delete this note"
    )
  }
}
