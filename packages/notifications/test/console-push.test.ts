import { describe, expect, it } from "vitest"
import {
  createConsolePush,
  createPush,
  getInvalidTokens,
  getSuccessTicketIds,
} from "../src"
import type { ExpoPushMessage, ExpoPushTicket } from "../src"

describe("console push provider", () => {
  it("returns ok tickets for each message", async () => {
    const provider = createConsolePush()
    const messages: ExpoPushMessage[] = [
      { to: "ExponentPushToken[abc]", title: "Hello", body: "World" },
      { to: "ExponentPushToken[def]", title: "Test", body: "Notification" },
    ]

    const tickets = await provider.send(messages)

    expect(tickets).toHaveLength(2)
    for (const ticket of tickets) {
      expect(ticket.status).toBe("ok")
    }
  })

  it("handles empty messages array", async () => {
    const provider = createConsolePush()
    const tickets = await provider.send([])

    expect(tickets).toHaveLength(0)
  })

  it("returns receipts for all ticket IDs", async () => {
    const provider = createConsolePush()
    const receipts = await provider.getReceipts(["t1", "t2", "t3"])

    expect(Object.keys(receipts)).toHaveLength(3)
    for (const receipt of Object.values(receipts)) {
      expect(receipt.status).toBe("ok")
    }
  })

  it("close is a no-op", async () => {
    const provider = createConsolePush()
    await expect(provider.close()).resolves.toBeUndefined()
  })
})

describe("createPush factory", () => {
  it("creates console provider", () => {
    const provider = createPush({ provider: "console" })
    expect(provider).toBeDefined()
    expect(provider.send).toBeInstanceOf(Function)
    expect(provider.getReceipts).toBeInstanceOf(Function)
    expect(provider.close).toBeInstanceOf(Function)
  })

  it("creates expo provider", () => {
    const provider = createPush({ provider: "expo" })
    expect(provider).toBeDefined()
    expect(provider.send).toBeInstanceOf(Function)
    expect(provider.getReceipts).toBeInstanceOf(Function)
  })
})

describe("ticket utilities", () => {
  it("extracts success ticket IDs", () => {
    const tickets: ExpoPushTicket[] = [
      { status: "ok", id: "ticket-1" },
      {
        status: "error",
        message: "failed",
        details: { error: "MessageTooBig" },
      },
      { status: "ok", id: "ticket-3" },
    ]

    const ids = getSuccessTicketIds(tickets)
    expect(ids).toEqual(["ticket-1", "ticket-3"])
  })

  it("returns empty array when no successes", () => {
    const tickets: ExpoPushTicket[] = [
      {
        status: "error",
        message: "failed",
        details: { error: "MessageTooBig" },
      },
    ]

    expect(getSuccessTicketIds(tickets)).toEqual([])
  })

  it("extracts invalid tokens from DeviceNotRegistered errors", () => {
    const messages: ExpoPushMessage[] = [
      { to: "ExponentPushToken[good]", title: "Hi" },
      { to: "ExponentPushToken[bad1]", title: "Hi" },
      {
        to: ["ExponentPushToken[bad2]", "ExponentPushToken[bad3]"],
        title: "Hi",
      },
    ]
    const tickets: ExpoPushTicket[] = [
      { status: "ok", id: "t1" },
      {
        status: "error",
        message: "not registered",
        details: { error: "DeviceNotRegistered" },
      },
      {
        status: "error",
        message: "not registered",
        details: { error: "DeviceNotRegistered" },
      },
    ]

    const invalid = getInvalidTokens(tickets, messages)
    expect(invalid).toEqual([
      "ExponentPushToken[bad1]",
      "ExponentPushToken[bad2]",
      "ExponentPushToken[bad3]",
    ])
  })

  it("ignores non-DeviceNotRegistered errors", () => {
    const messages: ExpoPushMessage[] = [
      { to: "ExponentPushToken[x]", title: "Hi" },
    ]
    const tickets: ExpoPushTicket[] = [
      {
        status: "error",
        message: "too big",
        details: { error: "MessageTooBig" },
      },
    ]

    expect(getInvalidTokens(tickets, messages)).toEqual([])
  })

  it("handles empty arrays", () => {
    expect(getSuccessTicketIds([])).toEqual([])
    expect(getInvalidTokens([], [])).toEqual([])
  })
})
