import { Module } from "@nestjs/common"
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core"
import { ZodValidationPipe } from "nestjs-zod"
import { CqrsModule } from "@nestjs/cqrs"
import { AuthModule } from "@thallesp/nestjs-better-auth"
import { getAuth } from "@workspace/auth"
import { AuthGuardsModule } from "@workspace/auth/nestjs"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import {
  DatabaseModule,
  DATABASE_READY,
} from "./common/database/database.module"
import { StorageModule } from "./common/storage/storage.module"
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter"
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor"
import { TransformResponseInterceptor } from "./common/interceptors/transform-response.interceptor"
import { HealthModule } from "./modules/health/health.module"
import { MeModule } from "./modules/me/me.module"
import { NotesModule } from "./modules/notes/notes.module"
import { UploadsModule } from "./modules/uploads/uploads.module"

@Module({
  imports: [
    CqrsModule.forRoot(),
    AuthGuardsModule.register(),
    DatabaseModule,
    StorageModule,
    HealthModule,
    MeModule,
    NotesModule,
    UploadsModule,
    AuthModule.forRootAsync({
      imports: [DatabaseModule],
      inject: [DATABASE_READY],
      disableGlobalAuthGuard: true,
      useFactory: () => ({
        auth: getAuth(),
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
