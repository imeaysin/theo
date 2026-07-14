import { Module, Global } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { AuthModule as BetterAuthModule } from "@thallesp/nestjs-better-auth"
import { getAuth } from "@workspace/auth"
import type { CacheProvider } from "@workspace/cache"
import { AppEvents } from "@/common/events"
import { UserDeletedEvent } from "@/modules/users/events/user-deleted.event"
import { CacheModule, CACHE_PROVIDER } from "@/common/cache/cache.module"
import {
  DatabaseModule,
  DATABASE_READY,
} from "@/common/database/database.module"

@Global()
@Module({
  imports: [
    BetterAuthModule.forRootAsync({
      imports: [DatabaseModule, CacheModule],
      inject: [DATABASE_READY, CACHE_PROVIDER, EventEmitter2],
      useFactory: (
        _dbReady: unknown,
        cache: CacheProvider,
        eventEmitter: EventEmitter2
      ) => ({
        auth: getAuth({
          secondaryStorage: cache,
          onUserDeleted: (userId: string) => {
            eventEmitter.emit(
              AppEvents.USER_DELETED,
              new UserDeletedEvent(userId)
            )
          },
        }),
        bodyParser: {
          json: { limit: "2mb" },
          urlencoded: { limit: "2mb", extended: true },
          rawBody: true,
        },
      }),
    }),
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
