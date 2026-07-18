import { Inject, Injectable } from "@nestjs/common"
import { createLogger } from "@workspace/logger"
import {
  getInvalidTokens,
  type ExpoPushMessage,
  type PushProvider,
} from "@workspace/notifications"
import type {
  SendNotificationInput,
  SendNotificationResponse,
  NotificationListResponse,
} from "@workspace/contracts"
import { PUSH_PROVIDER } from "@/common/push/push.module"
import { RealtimeGateway } from "@/common/realtime/realtime.gateway"
import {
  NotificationQueryRepository,
  NotificationCommandRepository,
} from "./repository"
import type {
  NotificationUserScope,
  NotificationMutationScope,
  NewDeviceTokenEntity,
} from "./domain/notification.model"

const logger = createLogger("Notifications")

@Injectable()
export class NotificationsService {
  constructor(
    private readonly queryRepo: NotificationQueryRepository,
    private readonly commandRepo: NotificationCommandRepository,
    @Inject(PUSH_PROVIDER) private readonly push: PushProvider,
    private readonly realtimeGateway: RealtimeGateway
  ) {}

  async listNotifications(
    scope: NotificationUserScope
  ): Promise<NotificationListResponse> {
    const [notifications, totalUnread] = await Promise.all([
      this.queryRepo.findByUser(scope),
      this.queryRepo.countUnread(scope),
    ])
    return {
      totalUnread,
      items: notifications.map((n) => ({
        id: n.id,
        userId: n.userId,
        title: n.title,
        body: n.body,
        type: n.type,
        read: n.read,
        actionUrl: n.actionUrl,
        createdAt: n.createdAt.toISOString(),
      })),
    }
  }

  async countUnread(scope: NotificationUserScope): Promise<{ count: number }> {
    const count = await this.queryRepo.countUnread(scope)
    return { count }
  }

  async markAsRead(scope: NotificationMutationScope): Promise<void> {
    await this.commandRepo.markAsRead(scope)
  }

  async markAllAsRead(
    scope: NotificationUserScope
  ): Promise<{ updatedCount: number }> {
    const updatedCount = await this.commandRepo.markAllAsRead(scope)
    return { updatedCount }
  }

  async deleteNotification(scope: NotificationMutationScope): Promise<void> {
    await this.commandRepo.delete(scope)
  }

  async registerDeviceToken(data: NewDeviceTokenEntity) {
    const token = await this.commandRepo.upsertToken(data)
    return {
      id: token.id,
      token: token.token,
      platform: token.platform,
      createdAt: token.createdAt.toISOString(),
      updatedAt: token.updatedAt.toISOString(),
    }
  }

  async unregisterDeviceToken(userId: string, token: string): Promise<void> {
    await this.commandRepo.removeByUserAndToken(userId, token)
  }

  async sendNotification(
    input: SendNotificationInput
  ): Promise<SendNotificationResponse> {
    const channels = new Set(input.channels)
    let sent = 0
    let pushDelivered = 0
    let invalidTokensRemoved = 0

    if (channels.has("in-app")) {
      const records = input.userIds.map((userId) => ({
        userId,
        title: input.title,
        body: input.body ?? "",
        type: input.type,
        actionUrl: input.actionUrl,
      }))

      sent = await this.commandRepo.insertMany(records)
    }

    if (channels.has("push")) {
      const tokens = await this.queryRepo.findTokensByUserIds(input.userIds)

      if (tokens.length > 0) {
        const messages: ExpoPushMessage[] = tokens.map((dt) => ({
          to: dt.token,
          title: input.title,
          body: input.body,
          data: input.data,
        }))

        const tickets = await this.push.send(messages)

        pushDelivered = tickets.filter((t) => t.status === "ok").length

        const invalidPushTokens = getInvalidTokens(tickets, messages)
        if (invalidPushTokens.length > 0) {
          invalidTokensRemoved =
            await this.commandRepo.removeManyByTokens(invalidPushTokens)
          logger.info(
            { count: invalidTokensRemoved },
            "cleaned up invalid device tokens"
          )
        }
      }
    }

    for (const userId of input.userIds) {
      try {
        this.realtimeGateway.emitToUser(userId, "notification.created", {
          type: "notification.created",
          title: input.title,
          notificationType: input.type,
        })
      } catch (err) {
        logger.error({ err, userId }, "event publish failed")
      }
    }

    return { sent, pushDelivered, invalidTokensRemoved }
  }
}
