import { Inject } from "@nestjs/common"
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import type { JobQueue } from "@workspace/jobs"
import type { NoteResponse } from "@workspace/contracts"
import { JOB_QUEUE } from "../../../common/jobs/jobs.module"
import { toNoteResponse } from "../dto/note-response.mapper"
import { NotesRepository } from "../repositories/notes.repository"
import { CreateNoteCommand } from "./create-note.command"

@CommandHandler(CreateNoteCommand)
export class CreateNoteHandler implements ICommandHandler<CreateNoteCommand> {
  constructor(
    private readonly notesRepository: NotesRepository,
    @Inject(JOB_QUEUE) private readonly jobQueue: JobQueue
  ) {}

  async execute(command: CreateNoteCommand): Promise<NoteResponse> {
    const note = await this.notesRepository.insert(command.entity)

    this.jobQueue.enqueue("note.created", {
      noteId: note._id.toString(),
      ...command.scope,
    })

    return toNoteResponse(note)
  }
}
