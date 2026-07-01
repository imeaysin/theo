import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import {
  BulkDeleteNotesResponseSchema,
  type BulkDeleteNotesResponse,
} from "@workspace/contracts"
import { NotesRepository } from "../repositories/notes.repository"
import { BulkDeleteNotesCommand } from "./bulk-delete-notes.command"

@CommandHandler(BulkDeleteNotesCommand)
export class BulkDeleteNotesHandler implements ICommandHandler<BulkDeleteNotesCommand> {
  constructor(private readonly notesRepository: NotesRepository) {}

  async execute(
    command: BulkDeleteNotesCommand
  ): Promise<BulkDeleteNotesResponse> {
    const deletedCount = await this.notesRepository.deleteManyByIdsForUser(
      command.input.ids,
      command.userId
    )
    return BulkDeleteNotesResponseSchema.parse({ deletedCount })
  }
}
