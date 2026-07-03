import { Inject } from "@nestjs/common"
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs"
import type { SendNotificationResponse } from "@workspace/contracts"
import { createLogger } from "@workspace/logger"
import {
  getInvalidTokens,
  type ExpoPushMessage,
  type PushProvider,
} from "@workspace/notifications"
import type { EventBus } from "@workspace/realtime"
import { PUSH_PROVIDER } from "../../../../common/push/push.module"
import { EVENT_BUS } from "../../../../common/realtime/realtime.module"
import { DeviceTokenRepository } from "../../repositories/device-token.repository"
import { NotificationRepository } from "../../repositories/notification.repository"
import { SendNotificationCommand } from "./send-notification.command"

const logger = createLogger("Notifications")

@CommandHandler(SendNotificationCommand)
export class SendNotificationHandler implements ICommandHandler<SendNotificationCommand> {
  constructor(
    private readonly deviceTokens: DeviceTokenRepository,
    private readonly notifications: NotificationRepository,
    @Inject(PUSH_PROVIDER) private readonly push: PushProvider,
    @Inject(EVENT_BUS) private readonly eventBus: EventBus
  ) {}

  async execute(
    command: SendNotificationCommand
  ): Promise<SendNotificationResponse> {
    const { input } = command
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

      sent = await this.notifications.insertMany(records)
    }

    if (channels.has("push")) {
      const tokens = await this.deviceTokens.findByUserIds(input.userIds)

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
            await this.deviceTokens.removeManyByTokens(invalidPushTokens)
          logger.info(
            { count: invalidTokensRemoved },
            "cleaned up invalid device tokens"
          )
        }
      }
    }

    for (const userId of input.userIds) {
      this.eventBus
        .publish(
          `user:${userId}`,
          JSON.stringify({
            type: "notification.created",
            title: input.title,
            notificationType: input.type,
          })
        )
        .catch((err) => logger.error({ err, userId }, "event publish failed"))
    }

    return { sent, pushDelivered, invalidTokensRemoved }
  }
}
