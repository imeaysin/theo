import { Module } from "@nestjs/common"
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core"
import { ZodValidationPipe } from "nestjs-zod"
import { CqrsModule } from "@nestjs/cqrs"
import { AuthModule } from "@thallesp/nestjs-better-auth"
import { getAuth } from "@workspace/auth"
import type { CacheProvider } from "@workspace/cache"
import { AuthGuardsModule } from "@workspace/auth/nestjs"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { CacheModule, CACHE_PROVIDER } from "./common/cache/cache.module"
import {
  DatabaseModule,
  DATABASE_READY,
} from "./common/database/database.module"
import { JobsModule } from "./common/jobs/jobs.module"
import { PushModule } from "./common/push/push.module"
import { RealtimeModule } from "./common/realtime/realtime.module"
import { StorageModule } from "./common/storage/storage.module"
import { PaymentModule } from "./common/payment/payment.module"
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter"
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor"
import { TransformResponseInterceptor } from "./common/interceptors/transform-response.interceptor"
import { HealthModule } from "./modules/health/health.module"
import { MeModule } from "./modules/me/me.module"
import { EventsModule } from "./modules/events/events.module"
import { NotesModule } from "./modules/notes/notes.module"
import { NotificationsModule } from "./modules/notifications/notifications.module"
import { UploadsModule } from "./modules/uploads/uploads.module"
import { AiModule } from "./modules/ai/ai.module"

@Module({
  imports: [
    CqrsModule.forRoot(),
    AuthGuardsModule.register(),
    CacheModule,
    DatabaseModule,
    JobsModule,
    PushModule,
    RealtimeModule,
    StorageModule,
    PaymentModule,
    EventsModule,
    HealthModule,
    MeModule,
    NotesModule,
    NotificationsModule,
    UploadsModule,
    AiModule,
    AuthModule.forRootAsync({
      imports: [DatabaseModule, CacheModule],
      inject: [DATABASE_READY, CACHE_PROVIDER],
      disableGlobalAuthGuard: true,
      useFactory: (_dbReady: unknown, cache: CacheProvider) => ({
        auth: getAuth({ secondaryStorage: cache }),
        bodyParser: {
          json: { limit: "2mb" },
          urlencoded: { limit: "2mb", extended: true },
          rawBody: true,
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
  ],
})
export class AppModule {}
