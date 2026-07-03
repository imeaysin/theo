import type { NotificationUserScope } from "../../notification.scope"

export class CountUnreadNotificationsQuery {
  constructor(public readonly userId: string) {}

  get scope(): NotificationUserScope {
    return { userId: this.userId }
  }
}
