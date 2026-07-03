import { createMemoryEventBus } from "./providers/memory"
import { createRedisEventBus } from "./providers/redis"
import type { EventBus, EventBusConfig } from "./types"

export { createMemoryEventBus } from "./providers/memory"
export { createRedisEventBus } from "./providers/redis"
export type {
  EventBus,
  EventBusConfig,
  EventHandler,
  MemoryEventBusConfig,
  RedisEventBusConfig,
  Unsubscribe,
} from "./types"

export function createEventBus(config: EventBusConfig): EventBus {
  switch (config.provider) {
    case "memory":
      return createMemoryEventBus()
    case "redis":
      return createRedisEventBus(config)
    default: {
      const _exhaustive: never = config
      throw new Error(`Unknown event bus provider: ${_exhaustive}`)
    }
  }
}
