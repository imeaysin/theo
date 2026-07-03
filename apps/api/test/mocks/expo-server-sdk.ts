import type { ExpoPushMessage, ExpoPushTicket } from "@workspace/notifications"

export class Expo {
  public options?: { accessToken?: string }

  constructor(options?: { accessToken?: string }) {
    this.options = options
  }

  chunkPushNotifications(messages: ExpoPushMessage[]): ExpoPushMessage[][] {
    return [messages]
  }

  async sendPushNotificationsAsync(
    chunks: ExpoPushMessage[]
  ): Promise<ExpoPushTicket[]> {
    return chunks.map(() => ({ status: "ok", id: "mock-id" }) as ExpoPushTicket)
  }

  static isExpoPushToken(_token: string): boolean {
    return true
  }
}
