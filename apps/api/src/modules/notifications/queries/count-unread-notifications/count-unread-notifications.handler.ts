import { QueryHandler, type IQueryHandler } from "@nestjs/cqrs"
import {
  UnreadCountResponseSchema,
  type UnreadCountResponse,
} from "@workspace/contracts"
import { NotificationRepository } from "../../repositories/notification.repository"
import { CountUnreadNotificationsQuery } from "./count-unread-notifications.query"

@QueryHandler(CountUnreadNotificationsQuery)
export class CountUnreadNotificationsHandler implements IQueryHandler<CountUnreadNotificationsQuery> {
  constructor(private readonly notifications: NotificationRepository) {}

  async execute(
    query: CountUnreadNotificationsQuery
  ): Promise<UnreadCountResponse> {
    const count = await this.notifications.countUnread(query.scope)
    return UnreadCountResponseSchema.parse({ count })
  }
}
