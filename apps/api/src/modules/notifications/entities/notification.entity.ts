import type { ObjectId } from "mongodb"

export type NotificationEntity = {
  _id: ObjectId
  userId: string
  title: string
  body: string
  type: string
  read: boolean
  actionUrl?: string
  createdAt: Date
}

export type NewNotificationEntity = Pick<
  NotificationEntity,
  "userId" | "title" | "body" | "type" | "actionUrl"
>
