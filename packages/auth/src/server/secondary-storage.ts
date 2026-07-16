import { redisStorage } from "@better-auth/redis-storage"
import { createRedisClient } from "@workspace/redis"
import { env } from "@workspace/config"

/** Official Better Auth Redis secondary storage (sessions, rate limits, OTPs). */
export function createAuthSecondaryStorage() {
  return redisStorage({
    client: createRedisClient(env.REDIS_URL),
  })
}
