import Redis from "ioredis"

export type { Redis }

export function createRedisClient(url: string): Redis {
  return new Redis(url)
}
