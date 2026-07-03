import { describe, expect, it, vi } from "vitest"
import { createEventBus, createMemoryEventBus } from "../src"

describe("memory event bus", () => {
  it("delivers messages to subscribers", async () => {
    const bus = createMemoryEventBus()
    const received: string[] = []

    await bus.subscribe("test", (payload) => received.push(payload))
    await bus.publish("test", '{"hello":"world"}')

    expect(received).toEqual(['{"hello":"world"}'])
    await bus.close()
  })

  it("supports multiple subscribers on the same channel", async () => {
    const bus = createMemoryEventBus()
    const a: string[] = []
    const b: string[] = []

    await bus.subscribe("ch", (p) => a.push(p))
    await bus.subscribe("ch", (p) => b.push(p))
    await bus.publish("ch", "msg")

    expect(a).toEqual(["msg"])
    expect(b).toEqual(["msg"])
    await bus.close()
  })

  it("isolates channels", async () => {
    const bus = createMemoryEventBus()
    const received: string[] = []

    await bus.subscribe("a", (p) => received.push(p))
    await bus.publish("b", "nope")

    expect(received).toEqual([])
    await bus.close()
  })

  it("unsubscribe stops delivery", async () => {
    const bus = createMemoryEventBus()
    const received: string[] = []

    const unsubscribe = await bus.subscribe("ch", (p) => received.push(p))
    await bus.publish("ch", "before")

    unsubscribe()
    await bus.publish("ch", "after")

    expect(received).toEqual(["before"])
    await bus.close()
  })

  it("close removes all listeners", async () => {
    const bus = createMemoryEventBus()
    const handler = vi.fn()

    await bus.subscribe("ch", handler)
    await bus.close()
    await bus.publish("ch", "after-close")

    expect(handler).not.toHaveBeenCalled()
  })
})

describe("createEventBus factory", () => {
  it("creates memory provider", () => {
    const bus = createEventBus({ provider: "memory" })
    expect(bus).toBeDefined()
    expect(bus.publish).toBeInstanceOf(Function)
    expect(bus.subscribe).toBeInstanceOf(Function)
    expect(bus.close).toBeInstanceOf(Function)
  })
})
