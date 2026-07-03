import {
  Global,
  Inject,
  Module,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common"
import { createCache, type CacheProvider } from "@workspace/cache"
import { cacheEnv } from "@workspace/config/cache"
import { createLogger } from "@workspace/logger"

export const CACHE_PROVIDER = Symbol("CACHE_PROVIDER")

function createCacheProvider(): CacheProvider {
  if (cacheEnv.CACHE_PROVIDER === "redis") {
    return createCache({ provider: "redis", redisUrl: cacheEnv.REDIS_URL })
  }

  return createCache({ provider: "memory" })
}

@Global()
@Module({
  providers: [{ provide: CACHE_PROVIDER, useFactory: createCacheProvider }],
  exports: [CACHE_PROVIDER],
})
export class CacheModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(CACHE_PROVIDER) private readonly cache: CacheProvider) {}

  onModuleInit() {
    createLogger("Cache").info(
      { provider: cacheEnv.CACHE_PROVIDER },
      "cache ready"
    )
  }

  onModuleDestroy() {
    void this.cache.close()
  }
}
