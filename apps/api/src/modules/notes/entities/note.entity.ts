import type { ObjectId } from "mongodb"

/** Persistence shape stored in MongoDB. */
export type NoteRecord = {
  _id: ObjectId
  organizationId: string
  userId: string
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
}

/** Feature entity returned from the repository layer. */
export type NoteEntity = {
  id: string
  organizationId: string
  userId: string
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
}

export function toNoteEntity(record: NoteRecord): NoteEntity {
  return {
    id: record._id.toString(),
    organizationId: record.organizationId,
    userId: record.userId,
    title: record.title,
    body: record.body,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }
}
