import { Injectable } from "@nestjs/common"
import { isValidObjectId } from "mongoose"
import { BaseMongoRepository } from "@/common/database/repositories"
import { NoteModel } from "@workspace/db"
import { NoteNotFoundException } from "../domain/exceptions/note-not-found.exception"
import type {
  NoteEntity,
  NewNoteEntity,
  NoteMutationScope,
  BulkNoteMutationScope,
} from "../domain/note.model"
import { assertNoteAccessOrThrow } from "../notes-access.util"
import { NoteQueryRepository } from "./note.query"

@Injectable()
export class NoteCommandRepository extends BaseMongoRepository {
  constructor(private readonly queryRepo: NoteQueryRepository) {
    super()
  }

  async insert(data: NewNoteEntity): Promise<NoteEntity> {
    const doc = await this.guardInsert(() =>
      NoteModel.create({
        organizationId: data.organizationId,
        userId: data.userId,
        title: data.title,
        body: data.body,
      })
    )

    return {
      id: doc._id.toString(),
      organizationId: doc.organizationId,
      userId: doc.userId,
      title: doc.title,
      body: doc.body,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  async update(
    scope: NoteMutationScope,
    data: Partial<Pick<NoteEntity, "title" | "body">>
  ): Promise<NoteEntity | null> {
    if (!isValidObjectId(scope.noteId)) return null

    const doc = await NoteModel.findOneAndUpdate(
      {
        _id: scope.noteId,
        organizationId: scope.organizationId,
        userId: scope.userId,
      },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after", lean: true }
    )

    if (!doc) return null

    return {
      id: doc._id.toString(),
      organizationId: doc.organizationId,
      userId: doc.userId,
      title: doc.title,
      body: doc.body,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  async delete(scope: NoteMutationScope): Promise<boolean> {
    if (!isValidObjectId(scope.noteId)) return false

    const result = await NoteModel.deleteOne({
      _id: scope.noteId,
      organizationId: scope.organizationId,
      userId: scope.userId,
    })

    return result.deletedCount > 0
  }

  async deleteManyByUserId(userId: string): Promise<number> {
    const result = await NoteModel.deleteMany({ userId })
    return result.deletedCount
  }

  async deleteMany(scope: BulkNoteMutationScope): Promise<number> {
    const validIds = scope.ids.filter(isValidObjectId)
    if (validIds.length === 0) return 0

    const result = await NoteModel.deleteMany({
      _id: { $in: validIds },
      organizationId: scope.organizationId,
      userId: scope.userId,
    })

    return result.deletedCount
  }

  async deleteManyOrThrow(scope: BulkNoteMutationScope): Promise<number> {
    const uniqueValidIds = [...new Set(scope.ids.filter(isValidObjectId))]
    const deletedCount = await this.deleteMany(scope)

    const hasInvalidId = scope.ids.some((id) => !isValidObjectId(id))
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
