import type { NotificationUserScope } from "../../notification.scope"

export class MarkAllNotificationsReadCommand {
  constructor(public readonly userId: string) {}

  get scope(): NotificationUserScope {
    return { userId: this.userId }
  }
}
