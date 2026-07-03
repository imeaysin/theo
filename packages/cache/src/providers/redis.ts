import { createRedisClient } from "@workspace/redis"
import type { CacheProvider, RedisCacheConfig } from "../types"

const DEFAULT_KEY_PREFIX = "cache:"

export function createRedisCache(config: RedisCacheConfig): CacheProvider {
  const client = createRedisClient(config.redisUrl)
  const prefix = config.keyPrefix ?? DEFAULT_KEY_PREFIX

  function prefixKey(key: string): string {
    return `${prefix}${key}`
  }

  return {
    async get(key) {
      return client.get(prefixKey(key))
    },

    async set(key, value, ttl) {
      const k = prefixKey(key)
      if (ttl !== undefined && ttl > 0) {
        await client.setex(k, ttl, value)
      } else {
        await client.set(k, value)
      }
    },

    async delete(key) {
      await client.del(prefixKey(key))
    },

    async has(key) {
      const result = await client.exists(prefixKey(key))
      return result === 1
    },

    async close() {
      await client.quit()
    },
  }
}
