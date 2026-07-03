import { createRedisClient } from "@workspace/redis"
import { createLogger } from "@workspace/logger"
import type { EventBus, EventHandler, RedisEventBusConfig } from "../types"

/**
 * Redis pub/sub event bus.
 *
 * Creates two connections: one dedicated subscriber, one for publishing.
 * A Redis client in subscribe mode cannot issue non-pub/sub commands.
 */
export function createRedisEventBus(config: RedisEventBusConfig): EventBus {
  const logger = createLogger("EventBus")
  const pub = createRedisClient(config.redisUrl)
  const sub = createRedisClient(config.redisUrl)

  const handlers = new Map<string, Set<EventHandler>>()

  sub.on("message", (channel: string, message: string) => {
    const channelHandlers = handlers.get(channel)
    if (!channelHandlers) return

    for (const handler of channelHandlers) {
      try {
        handler(message)
      } catch (err) {
        logger.error({ err, channel }, "event handler threw")
      }
    }
  })

  return {
    async publish(channel, payload) {
      await pub.publish(channel, payload)
    },

    async subscribe(channel, handler) {
      let channelHandlers = handlers.get(channel)
      if (!channelHandlers) {
        channelHandlers = new Set()
        handlers.set(channel, channelHandlers)
        await sub.subscribe(channel)
      }

      channelHandlers.add(handler)

      return () => {
        channelHandlers.delete(handler)
        if (channelHandlers.size === 0) {
          handlers.delete(channel)
          sub.unsubscribe(channel).catch((err: unknown) => {
            logger.error({ err, channel }, "unsubscribe failed")
          })
        }
      }
    },

    async close() {
      handlers.clear()
      await sub.quit()
      await pub.quit()
    },
  }
}
