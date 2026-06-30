import { Injectable } from "@nestjs/common"
import { getDb } from "@workspace/db"
import { ObjectId } from "mongodb"
import {
  NoteEntity,
  NoteRecord,
  toNoteEntity,
} from "../entities/note.entity"

const COLLECTION = "notes"

@Injectable()
export class NotesRepository {
  async findByUserId(userId: string): Promise<NoteEntity[]> {
    const records = await getDb()
      .collection<NoteRecord>(COLLECTION)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()

    return records.map(toNoteEntity)
  }

  async insert(
    data: Pick<NoteEntity, "userId" | "title" | "body">
  ): Promise<NoteEntity> {
    const now = new Date()

    const { insertedId } = await getDb()
      .collection<Omit<NoteRecord, "_id">>(COLLECTION)
      .insertOne({
        userId: data.userId,
        title: data.title,
        body: data.body,
        createdAt: now,
        updatedAt: now,
      })

    return {
      id: insertedId.toString(),
      userId: data.userId,
      title: data.title,
      body: data.body,
      createdAt: now,
      updatedAt: now,
    }
  }

  async findById(id: string): Promise<NoteEntity | null> {
    if (!ObjectId.isValid(id)) return null

    const record = await getDb()
      .collection<NoteRecord>(COLLECTION)
      .findOne({ _id: new ObjectId(id) })

    return record ? toNoteEntity(record) : null
  }

  async deleteByIdForUser(id: string, userId: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false

    const result = await getDb()
      .collection<NoteRecord>(COLLECTION)
      .deleteOne({ _id: new ObjectId(id), userId })

    return result.deletedCount > 0
  }
}
