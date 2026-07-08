import type {
  IReadRepository,
  IWriteRepository,
} from "@/common/database/repositories"
import type { NoteEntity, NewNoteEntity } from "../entities/note.entity"
import type {
  BulkNoteMutationScope,
  NoteActorScope,
  NoteMutationScope,
} from "../note.scope"

export type INotesReadRepository = IReadRepository<
  NoteEntity,
  string,
  NoteActorScope
>

export interface INotesWriteRepository extends IWriteRepository<
  NoteEntity,
  NewNoteEntity,
  string,
  Partial<Pick<NoteEntity, "title" | "body">>,
  NoteMutationScope
> {
  deleteMany(scope: BulkNoteMutationScope): Promise<number>
  // Throws 404 / 403 when any id is missing or belongs to another user
  deleteManyOrThrow(scope: BulkNoteMutationScope): Promise<number>
  rejectBulkMutationMiss(scope: BulkNoteMutationScope): Promise<never>
  rejectMutationMiss(scope: NoteMutationScope): Promise<never>
}
