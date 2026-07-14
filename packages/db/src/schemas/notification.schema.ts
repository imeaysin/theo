import mongoose, { Schema, type Document, type Types } from "mongoose"

export interface INotification extends Document {
  _id: Types.ObjectId
  userId: string
  title: string
  body: string
  type: string
  read: boolean
  actionUrl?: string
  createdAt: Date
}

export const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, required: true },
  read: { type: Boolean, required: true, default: false },
  actionUrl: { type: String, required: false },
  createdAt: { type: Date, required: true, default: Date.now },
})

// Indexes mapped from old query repository
NotificationSchema.index({ userId: 1, createdAt: -1 })
NotificationSchema.index({ userId: 1, read: 1 })

export const NotificationModel = mongoose.models.Notification
  ? mongoose.model<INotification>("Notification")
  : mongoose.model<INotification>(
      "Notification",
      NotificationSchema,
      "notifications"
    )
