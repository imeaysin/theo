import { Inject, Injectable } from "@nestjs/common"
import { ObjectId, type Db } from "mongodb"
import { MONGO_DB } from "@/common/database/database.module"
import { BaseMongoRepository } from "@/common/database/repositories"
import { NoteNotFoundException } from "../domain/exceptions/note-not-found.exception"
import type {
  NoteEntity,
  NewNoteEntity,
  NoteMutationScope,
  BulkNoteMutationScope,
} from "../domain/note.model"
import { assertNoteAccessOrThrow } from "../notes-access.util"
import { NoteQueryRepository } from "./note.query"

const COLLECTION = "notes"

@Injectable()
export class NoteCommandRepository extends BaseMongoRepository {
  constructor(
    @Inject(MONGO_DB) private readonly db: Db,
    private readonly queryRepo: NoteQueryRepository
  ) {
    super()
  }

  async insert(data: NewNoteEntity): Promise<NoteEntity> {
    const now = new Date()

    const doc = {
      organizationId: data.organizationId,
      userId: data.userId,
      title: data.title,
      body: data.body,
      createdAt: now,
      updatedAt: now,
    } satisfies Omit<NoteEntity, "_id">

    const { insertedId } = await this.guardInsert(() =>
      this.db.collection<Omit<NoteEntity, "_id">>(COLLECTION).insertOne(doc)
    )

    return { _id: insertedId, ...doc }
  }

  async update(
    scope: NoteMutationScope,
    data: Partial<Pick<NoteEntity, "title" | "body">>
  ): Promise<NoteEntity | null> {
    if (!ObjectId.isValid(scope.noteId)) return null

    const now = new Date()
    return this.db.collection<NoteEntity>(COLLECTION).findOneAndUpdate(
      {
        _id: new ObjectId(scope.noteId),
        organizationId: scope.organizationId,
        userId: scope.userId,
      },
      {
        $set: {
          ...data,
          updatedAt: now,
        },
      },
      { returnDocument: "after" }
    )
  }

  async delete(scope: NoteMutationScope): Promise<boolean> {
    if (!ObjectId.isValid(scope.noteId)) return false

    const result = await this.db.collection<NoteEntity>(COLLECTION).deleteOne({
      _id: new ObjectId(scope.noteId),
      organizationId: scope.organizationId,
      userId: scope.userId,
    })

    return result.deletedCount > 0
  }

  async deleteManyByUserId(userId: string): Promise<number> {
    const result = await this.db.collection<NoteEntity>(COLLECTION).deleteMany({
      userId,
    })

    return result.deletedCount
  }

  async deleteMany(scope: BulkNoteMutationScope): Promise<number> {
    const objectIds = scope.ids
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id))

    if (objectIds.length === 0) return 0

    const result = await this.db.collection<NoteEntity>(COLLECTION).deleteMany({
      _id: { $in: objectIds },
      organizationId: scope.organizationId,
      userId: scope.userId,
    })

    return result.deletedCount
  }

  async deleteManyOrThrow(scope: BulkNoteMutationScope): Promise<number> {
    const uniqueValidIds = [
      ...new Set(scope.ids.filter((id) => ObjectId.isValid(id))),
    ]
    const deletedCount = await this.deleteMany(scope)

    const hasInvalidId = scope.ids.some((id) => !ObjectId.isValid(id))
    if (hasInvalidId || deletedCount < uniqueValidIds.length) {
      await this.rejectBulkMutationMiss(scope)
    }

    return deletedCount
  }

  async rejectBulkMutationMiss(scope: BulkNoteMutationScope): Promise<never> {
    for (const id of scope.ids) {
      const existing = await this.queryRepo.findById(id)
      assertNoteAccessOrThrow(existing, scope.organizationId)
    }
    throw new NoteNotFoundException("Note not found")
  }

  async rejectMutationMiss(scope: NoteMutationScope): Promise<never> {
    const existing = await this.queryRepo.findById(scope.noteId)
    assertNoteAccessOrThrow(existing, scope.organizationId)
    throw new NoteNotFoundException("Note not found or could not be updated")
  }
}
