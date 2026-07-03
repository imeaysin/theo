export type CacheProvider = {
  get(key: string): Promise<string | null>
  set(key: string, value: string, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  has(key: string): Promise<boolean>
  close(): Promise<void>
}

export type MemoryCacheConfig = {
  provider: "memory"
}

export type RedisCacheConfig = {
  provider: "redis"
  redisUrl: string
  keyPrefix?: string
}

export type CacheConfig = MemoryCacheConfig | RedisCacheConfig
