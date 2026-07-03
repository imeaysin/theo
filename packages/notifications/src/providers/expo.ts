import Expo, { type ExpoPushReceipt } from "expo-server-sdk"
import { createLogger } from "@workspace/logger"
import type { ExpoPushConfig, PushProvider } from "../types"

export function createExpoPush(config: ExpoPushConfig): PushProvider {
  const logger = createLogger("Push")
  const expo = new Expo(
    config.accessToken ? { accessToken: config.accessToken } : undefined
  )

  return {
    async send(messages) {
      const chunks = expo.chunkPushNotifications(messages)
      const tickets = []

      for (const chunk of chunks) {
        try {
          const result = await expo.sendPushNotificationsAsync(chunk)
          tickets.push(...result)
        } catch (err) {
          logger.error({ err, count: chunk.length }, "push chunk failed")
        }
      }

      return tickets
    },

    async getReceipts(ticketIds) {
      const chunks = expo.chunkPushNotificationReceiptIds(ticketIds)
      const allReceipts: Record<string, ExpoPushReceipt> = {}

      for (const chunk of chunks) {
        try {
          const receipts = await expo.getPushNotificationReceiptsAsync(chunk)
          Object.assign(allReceipts, receipts)
        } catch (err) {
          logger.error({ err, count: chunk.length }, "receipt chunk failed")
        }
      }

      return allReceipts
    },

    async close() {
      // Expo SDK is stateless — nothing to tear down
    },
  }
}
