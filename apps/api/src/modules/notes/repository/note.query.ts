import { Injectable } from "@nestjs/common"
import { isValidObjectId } from "mongoose"
import { NoteModel } from "@workspace/db"
import type { NoteEntity, NoteActorScope } from "../domain/note.model"

@Injectable()
export class NoteQueryRepository {
  async findMany(scope: NoteActorScope): Promise<NoteEntity[]> {
    const docs = await NoteModel.find({
      organizationId: scope.organizationId,
      userId: scope.userId,
    })
      .sort({ createdAt: -1 })
      .lean()

    return docs.map((doc) => ({
      id: doc._id.toString(),
      organizationId: doc.organizationId,
      userId: doc.userId,
      title: doc.title,
      body: doc.body,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }))
  }

  async findById(id: string): Promise<NoteEntity | null> {
    if (!isValidObjectId(id)) return null

    const doc = await NoteModel.findById(id).lean()
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
}
