import {
  NotificationResponseSchema,
  type NotificationResponse,
} from "@workspace/contracts"
import type { NotificationEntity } from "../entities/notification.entity"

export function toNotificationResponse(
  record: NotificationEntity
): NotificationResponse {
  return NotificationResponseSchema.parse({
    id: record._id.toString(),
    userId: record.userId,
    title: record.title,
    body: record.body,
    type: record.type,
    read: record.read,
    actionUrl: record.actionUrl,
    createdAt: record.createdAt.toISOString(),
  })
}
