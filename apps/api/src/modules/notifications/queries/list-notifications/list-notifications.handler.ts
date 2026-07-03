import { QueryHandler, type IQueryHandler } from "@nestjs/cqrs"
import {
  NotificationListResponseSchema,
  type NotificationListResponse,
} from "@workspace/contracts"
import { toNotificationResponse } from "../../dto/notification-response.mapper"
import { NotificationRepository } from "../../repositories/notification.repository"
import { ListNotificationsQuery } from "./list-notifications.query"

@QueryHandler(ListNotificationsQuery)
export class ListNotificationsHandler implements IQueryHandler<ListNotificationsQuery> {
  constructor(private readonly notifications: NotificationRepository) {}

  async execute(
    query: ListNotificationsQuery
  ): Promise<NotificationListResponse> {
    const [items, totalUnread] = await Promise.all([
      this.notifications.findByUser(query.scope),
      this.notifications.countUnread(query.scope),
    ])

    return NotificationListResponseSchema.parse({
      items: items.map(toNotificationResponse),
      totalUnread,
    })
  }
}
