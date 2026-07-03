import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs"
import { DomainErrorCode } from "@workspace/contracts"
import { apiNotFound } from "../../../../common/exceptions/api.exception"
import { NotificationRepository } from "../../repositories/notification.repository"
import { DeleteNotificationCommand } from "./delete-notification.command"

@CommandHandler(DeleteNotificationCommand)
export class DeleteNotificationHandler implements ICommandHandler<DeleteNotificationCommand> {
  constructor(private readonly notifications: NotificationRepository) {}

  async execute(command: DeleteNotificationCommand): Promise<void> {
    const deleted = await this.notifications.delete(command.scope)
    if (!deleted) {
      apiNotFound(
        "Notification not found",
        DomainErrorCode.NOTIFICATION_NOT_FOUND
      )
    }
  }
}
