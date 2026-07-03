import type { ExpoPushMessage, ExpoPushTicket } from "./types"

/**
 * Extracts ticket IDs from successful push tickets.
 * Use these IDs later with `getReceipts()` to check delivery status.
 */
export function getSuccessTicketIds(tickets: ExpoPushTicket[]): string[] {
  return tickets
    .filter((t): t is { status: "ok"; id: string } => t.status === "ok")
    .map((t) => t.id)
}

/**
 * Identifies push tokens that the Expo service reports as invalid
 * (DeviceNotRegistered). These tokens should be removed from the database.
 *
 * Each ticket corresponds to the message at the same index — when a ticket
 * is a DeviceNotRegistered error, the `to` field(s) from the matching
 * message are collected.
 */
export function getInvalidTokens(
  tickets: ExpoPushTicket[],
  messages: ExpoPushMessage[]
): string[] {
  const tokens: string[] = []

  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i]
    if (!ticket || ticket.status !== "error") continue
    if (ticket.details?.error !== "DeviceNotRegistered") continue

    const msg = messages[i]
    if (!msg) continue

    if (Array.isArray(msg.to)) {
      tokens.push(...msg.to)
    } else {
      tokens.push(msg.to)
    }
  }

  return tokens
}
