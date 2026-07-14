import mongoose, { Schema, type Document, type Types } from "mongoose"

export interface INote extends Document {
  _id: Types.ObjectId
  organizationId: string
  userId: string
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
}

export const NoteSchema = new Schema<INote>({
  organizationId: { type: String, required: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
})

NoteSchema.index({ organizationId: 1, userId: 1, createdAt: -1 })

export const NoteModel = mongoose.models.Note
  ? mongoose.model<INote>("Note")
  : mongoose.model<INote>("Note", NoteSchema, "notes")
