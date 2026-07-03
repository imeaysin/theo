export type EventHandler = (payload: string) => void

export type EventBus = {
  publish(channel: string, payload: string): Promise<void>
  subscribe(channel: string, handler: EventHandler): Promise<Unsubscribe>
  close(): Promise<void>
}

export type Unsubscribe = () => void

export type MemoryEventBusConfig = {
  provider: "memory"
}

export type RedisEventBusConfig = {
  provider: "redis"
  redisUrl: string
}

export type EventBusConfig = MemoryEventBusConfig | RedisEventBusConfig
