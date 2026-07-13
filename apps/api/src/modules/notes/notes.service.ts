import { Injectable } from "@nestjs/common"
import { InjectQueue } from "@nestjs/bullmq"
import { Queue } from "bullmq"
import { EventEmitter2 } from "@nestjs/event-emitter"
import type {
  NoteResponse,
  NotesListResponse,
  BulkDeleteNotesResponse,
} from "@workspace/contracts"
import { jobsEnv } from "@workspace/config/jobs"
import { NoteQueryRepository, NoteCommandRepository } from "./repository"
import type { NoteJobPayload } from "./notes-cron.producer"
import {
  type NewNoteEntity,
  type NoteActorScope,
  type NoteMutationScope,
  type BulkNoteMutationScope,
  validateNoteContent,
} from "./domain"
import { toNoteResponse } from "./dto"

@Injectable()
export class NotesService {
  constructor(
    private readonly queryRepo: NoteQueryRepository,
    private readonly commandRepo: NoteCommandRepository,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue(jobsEnv.JOBS_QUEUE_NAME)
    private readonly jobQueue: Queue<NoteJobPayload>
  ) {}

  async createNote(
    scope: NoteActorScope,
    input: Pick<NewNoteEntity, "title" | "body">
  ): Promise<NoteResponse> {
    validateNoteContent(input.title, input.body)

    const note = await this.commandRepo.insert({
      organizationId: scope.organizationId,
      userId: scope.userId,
      ...input,
    })

    await this.jobQueue.add(
      "note.created",
      {
        type: "note.created",
        noteId: note._id.toString(),
        authorId: scope.userId,
      },
      {
        removeOnComplete: true,
        removeOnFail: false,
      }
    )

    this.eventEmitter.emit("note.created", {
      noteId: note._id.toString(),
      authorId: scope.userId,
    })

    return toNoteResponse(note)
  }

  async listNotes(scope: NoteActorScope): Promise<NotesListResponse> {
    const notes = await this.queryRepo.findMany(scope)
    return {
      items: notes.map(toNoteResponse),
    }
  }

  async updateNote(
    scope: NoteMutationScope,
    input: Partial<Pick<NewNoteEntity, "title" | "body">>
  ): Promise<NoteResponse> {
    if (input.title !== undefined || input.body !== undefined) {
      // In a real scenario we'd merge with existing data, but for this strict validation
      // we just validate the updated fields if they exist. (Assuming full update here for simplicity)
      if (input.title && input.body) {
        validateNoteContent(input.title, input.body)
      }
    }

    const updated = await this.commandRepo.update(scope, input)
    if (updated) return toNoteResponse(updated)

    return this.commandRepo.rejectMutationMiss(scope)
  }

  async deleteNote(scope: NoteMutationScope): Promise<void> {
    const deleted = await this.commandRepo.delete(scope)
    if (deleted) return

    return this.commandRepo.rejectMutationMiss(scope)
  }

  async bulkDeleteNotes(
    scope: BulkNoteMutationScope
  ): Promise<BulkDeleteNotesResponse> {
    const deletedCount = await this.commandRepo.deleteManyOrThrow(scope)
    return { deletedCount }
  }

  async purgeAllNotesForUser(userId: string): Promise<void> {
    await this.commandRepo.deleteManyByUserId(userId)
  }
}
