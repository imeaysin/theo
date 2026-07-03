import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { DeleteNotificationHandler } from "./commands/delete-notification/delete-notification.handler"
import { MarkAllNotificationsReadHandler } from "./commands/mark-all-notifications-read/mark-all-notifications-read.handler"
import { MarkNotificationReadHandler } from "./commands/mark-notification-read/mark-notification-read.handler"
import { RegisterDeviceTokenHandler } from "./commands/register-device-token/register-device-token.handler"
import { SendNotificationHandler } from "./commands/send-notification/send-notification.handler"
import { UnregisterDeviceTokenHandler } from "./commands/unregister-device-token/unregister-device-token.handler"
import { NotificationsController } from "./notifications.controller"
import { CountUnreadNotificationsHandler } from "./queries/count-unread-notifications/count-unread-notifications.handler"
import { ListNotificationsHandler } from "./queries/list-notifications/list-notifications.handler"
import { DeviceTokenRepository } from "./repositories/device-token.repository"
import { NotificationRepository } from "./repositories/notification.repository"

@Module({
  imports: [CqrsModule],
  controllers: [NotificationsController],
  providers: [
    DeviceTokenRepository,
    NotificationRepository,
    RegisterDeviceTokenHandler,
    UnregisterDeviceTokenHandler,
    SendNotificationHandler,
    MarkNotificationReadHandler,
    MarkAllNotificationsReadHandler,
    DeleteNotificationHandler,
    ListNotificationsHandler,
    CountUnreadNotificationsHandler,
  ],
})
export class NotificationsModule {}
