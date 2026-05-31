import { Schema, model, type Document, type Model, type Types } from "mongoose"

export interface IUser {
  _id: Types.ObjectId
  name: string
  email: string
  role: "admin" | "user"
  banned: boolean
  banReason: string | null
  banExpires: Date | null
  emailVerified: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface IUserDocument extends Omit<IUser, "_id">, Document {
  id: string
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    banned: { type: Boolean, default: false },
    banReason: { type: String, default: null },
    banExpires: { type: Date, default: null },
    emailVerified: { type: Boolean, default: false },
    image: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: "users",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

export const UserModel: Model<IUserDocument> = model<IUserDocument>(
  "User",
  userSchema
)
