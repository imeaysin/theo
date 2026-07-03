import type { ExpoPushReceipt, ExpoPushTicket } from "expo-server-sdk"
import { createLogger } from "@workspace/logger"
import type { PushProvider } from "../types"

export function createConsolePush(): PushProvider {
  const logger = createLogger("Push")

  return {
    async send(messages) {
      for (const msg of messages) {
        logger.info(
          { to: msg.to, title: msg.title, body: msg.body },
          "push notification (console)"
        )
      }

      return messages.map((_msg, i): ExpoPushTicket => ({
        status: "ok",
        id: `console-${Date.now()}-${i}`,
      }))
    },

    async getReceipts(ticketIds) {
      const receipts: Record<string, ExpoPushReceipt> = {}
      for (const id of ticketIds) {
        receipts[id] = { status: "ok" }
      }
      return receipts
    },

    async close() {
      // nothing to tear down
    },
  }
}
