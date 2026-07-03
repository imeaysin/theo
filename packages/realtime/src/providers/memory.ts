import { EventEmitter } from "node:events"
import type { EventBus } from "../types"

export function createMemoryEventBus(): EventBus {
  const emitter = new EventEmitter()
  emitter.setMaxListeners(0)

  return {
    async publish(channel, payload) {
      emitter.emit(channel, payload)
    },

    async subscribe(channel, handler) {
      emitter.on(channel, handler)
      return () => {
        emitter.off(channel, handler)
      }
    },

    async close() {
      emitter.removeAllListeners()
    },
  }
}
