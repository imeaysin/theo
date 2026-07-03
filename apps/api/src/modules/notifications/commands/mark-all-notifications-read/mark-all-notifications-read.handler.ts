import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs"
import { NotificationRepository } from "../../repositories/notification.repository"
import { MarkAllNotificationsReadCommand } from "./mark-all-notifications-read.command"

@CommandHandler(MarkAllNotificationsReadCommand)
export class MarkAllNotificationsReadHandler implements ICommandHandler<MarkAllNotificationsReadCommand> {
  constructor(private readonly notifications: NotificationRepository) {}

  async execute(command: MarkAllNotificationsReadCommand): Promise<void> {
    await this.notifications.markAllAsRead(command.scope)
  }
}
