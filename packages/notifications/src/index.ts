import { createConsolePush } from "./providers/console"
import { createExpoPush } from "./providers/expo"
import type { PushConfig, PushProvider } from "./types"

export { createConsolePush } from "./providers/console"
export { createExpoPush } from "./providers/expo"
export { getInvalidTokens, getSuccessTicketIds } from "./utils"
export { Expo } from "expo-server-sdk"
export type {
  ConsolePushConfig,
  ExpoPushConfig,
  ExpoPushMessage,
  ExpoPushReceipt,
  ExpoPushSuccessTicket,
  ExpoPushTicket,
  PushConfig,
  PushProvider,
} from "./types"

export function createPush(config: PushConfig): PushProvider {
  switch (config.provider) {
    case "expo":
      return createExpoPush(config)
    case "console":
      return createConsolePush()
    default: {
      const _exhaustive: never = config
      throw new Error(`Unknown push provider: ${_exhaustive}`)
    }
  }
}
