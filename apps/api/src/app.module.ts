import { Module } from "@nestjs/common"
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core"
import { ZodValidationPipe } from "nestjs-zod"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { SentryModule } from "@sentry/nestjs/setup"
import { WorkspaceAuthModule } from "@workspace/auth/nestjs"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { isSentryEnabled } from "./observability/enabled"
import { CacheModule } from "./common/cache/cache.module"
import { DatabaseModule } from "./common/database/database.module"
import { JobsModule } from "./common/jobs/jobs.module"
import { PushModule } from "./common/push/push.module"
import { RealtimeModule } from "./common/realtime/realtime.module"
import { StorageModule } from "./common/storage/storage.module"
import { PaymentModule } from "./common/payment/payment.module"
import { GlobalExceptionsFilter } from "./common/filters/global-exceptions.filter"
import { HttpExceptionFilter } from "./common/filters/http-exception.filter"
import { DomainExceptionFilter } from "./common/filters/domain-exception.filter"
import { StorageExceptionFilter } from "./common/filters/storage-exception.filter"
import { ZodValidationExceptionFilter } from "./common/filters/zod-validation-exception.filter"
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor"
import { TransformResponseInterceptor } from "./common/interceptors/transform-response.interceptor"
import { HealthModule } from "./modules/health/health.module"
import { UsersModule } from "./modules/users/users.module"
import { NotesModule } from "./modules/notes/notes.module"
import { NotificationsModule } from "./modules/notifications/notifications.module"
import { UploadsModule } from "./modules/uploads/uploads.module"

@Module({
  imports: [
    ...(isSentryEnabled() ? [SentryModule.forRoot()] : []),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    WorkspaceAuthModule,
    CacheModule,
    JobsModule,
    PushModule,
    RealtimeModule,
    StorageModule,
    PaymentModule,
    HealthModule,
    UsersModule,
    NotesModule,
    NotificationsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_FILTER, useClass: GlobalExceptionsFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: StorageExceptionFilter },
    { provide: APP_FILTER, useClass: ZodValidationExceptionFilter },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
  ],
})
export class AppModule {}
