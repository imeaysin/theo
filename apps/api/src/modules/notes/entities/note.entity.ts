import type { ObjectId } from "mongodb"

/** Persistence shape stored in MongoDB. */
export interface NoteRecord {
  _id: ObjectId
  userId: string
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
}

/** Feature entity returned from the repository layer. */
export interface NoteEntity {
  id: string
  userId: string
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
}

export function toNoteEntity(record: NoteRecord): NoteEntity {
  return {
    id: record._id.toString(),
    userId: record.userId,
    title: record.title,
    body: record.body,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }
}
