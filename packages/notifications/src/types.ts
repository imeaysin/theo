import type {
  ExpoPushMessage,
  ExpoPushReceipt,
  ExpoPushSuccessTicket,
  ExpoPushTicket,
} from "expo-server-sdk"

export type {
  ExpoPushMessage,
  ExpoPushReceipt,
  ExpoPushSuccessTicket,
  ExpoPushTicket,
}

export type PushProvider = {
  send(messages: ExpoPushMessage[]): Promise<ExpoPushTicket[]>
  getReceipts(ticketIds: string[]): Promise<Record<string, ExpoPushReceipt>>
  close(): Promise<void>
}

export type ExpoPushConfig = {
  provider: "expo"
  accessToken?: string
}

export type ConsolePushConfig = {
  provider: "console"
}

export type PushConfig = ExpoPushConfig | ConsolePushConfig
