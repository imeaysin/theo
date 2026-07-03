import {
  Global,
  Inject,
  Module,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common"
import { createEventBus, type EventBus } from "@workspace/realtime"
import { realtimeEnv } from "@workspace/config/realtime"
import { createLogger } from "@workspace/logger"

export const EVENT_BUS = Symbol("EVENT_BUS")

function createEventBusProvider(): EventBus {
  if (realtimeEnv.REALTIME_PROVIDER === "redis") {
    return createEventBus({
      provider: "redis",
      redisUrl: realtimeEnv.REDIS_URL,
    })
  }

  return createEventBus({ provider: "memory" })
}

@Global()
@Module({
  providers: [{ provide: EVENT_BUS, useFactory: createEventBusProvider }],
  exports: [EVENT_BUS],
})
export class RealtimeModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(EVENT_BUS) private readonly eventBus: EventBus) {}

  onModuleInit() {
    createLogger("Realtime").info(
      { provider: realtimeEnv.REALTIME_PROVIDER },
      "event bus ready"
    )
  }

  onModuleDestroy() {
    void this.eventBus.close()
  }
}
