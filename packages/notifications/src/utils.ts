import type {
  ExpoPushMessage,
  ExpoPushSuccessTicket,
  ExpoPushTicket,
} from "expo-server-sdk"

/** Extract receipt IDs from successful tickets. */
export function getSuccessTicketIds(tickets: ExpoPushTicket[]): string[] {
  return tickets
    .filter((t): t is ExpoPushSuccessTicket => t.status === "ok")
    .map((t) => t.id)
}

/**
 * Extract push tokens that Expo flagged as unregistered/invalid.
 * Callers should remove these from their device-token store.
 *
 * Each ticket corresponds 1:1 with the message at the same index.
 */
export function getInvalidTokens(
  tickets: ExpoPushTicket[],
  messages: ExpoPushMessage[]
): string[] {
  const invalid: string[] = []

  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i]
    const msg = messages[i]
    if (!ticket || !msg) continue

    if (
      ticket.status === "error" &&
      ticket.details?.error === "DeviceNotRegistered"
    ) {
      const tokens = Array.isArray(msg.to) ? msg.to : [msg.to]
      invalid.push(...tokens)
    }
  }

  return invalid
}
