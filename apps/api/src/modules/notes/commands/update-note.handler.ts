import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import type { NoteResponse } from "@workspace/contracts"
import { toNoteResponse } from "../dto/note-response.mapper"
import { NotesRepository } from "../repositories/notes.repository"
import { assertNoteAccessOrThrow } from "../notes-access.util"
import { UpdateNoteCommand } from "./update-note.command"

@CommandHandler(UpdateNoteCommand)
export class UpdateNoteHandler implements ICommandHandler<UpdateNoteCommand> {
  constructor(private readonly notesRepository: NotesRepository) {}

  async execute(command: UpdateNoteCommand): Promise<NoteResponse> {
    const updated = await this.notesRepository.updateByIdForOrganizationAndUser(
      command.noteId,
      command.organizationId,
      command.userId,
      command.input
    )
    if (updated) return toNoteResponse(updated)

    const existing = await this.notesRepository.findById(command.noteId)
    assertNoteAccessOrThrow(
      existing,
      command.organizationId,
      "Not allowed to update this note"
    )
  }
}
