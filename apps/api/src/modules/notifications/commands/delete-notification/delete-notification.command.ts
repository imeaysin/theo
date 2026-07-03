import type { NotificationMutationScope } from "../../notification.scope"

export class DeleteNotificationCommand {
  constructor(
    public readonly userId: string,
    public readonly notificationId: string
  ) {}

  get scope(): NotificationMutationScope {
    return {
      userId: this.userId,
      notificationId: this.notificationId,
    }
  }
}
