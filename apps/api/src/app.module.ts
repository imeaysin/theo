import { Module } from "@nestjs/common"
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  Reflector,
} from "@nestjs/core"
import { CqrsModule } from "@nestjs/cqrs"
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { AuthModule } from "@thallesp/nestjs-better-auth"
import { auth } from "@workspace/auth"
import { JwksGuard, OrgRbacGuard, RbacGuard, RolesGuard } from "@workspace/auth/nestjs"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import {
  DatabaseModule,
  DATABASE_READY,
} from "./common/database/database.module"
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter"
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor"
import { TransformResponseInterceptor } from "./common/interceptors/transform-response.interceptor"
import { HealthModule } from "./modules/health/health.module"
import { MeModule } from "./modules/me/me.module"
import { NotesModule } from "./modules/notes/notes.module"

@Module({
  imports: [
    CqrsModule.forRoot(),
    DatabaseModule,
    HealthModule,
    MeModule,
    NotesModule,
    ThrottlerModule.forRoot([
      {
        name: "default",
        ttl: 60_000,
        limit: 120,
      },
    ]),
    AuthModule.forRootAsync({
      imports: [DatabaseModule],
      inject: [DATABASE_READY],
      disableGlobalAuthGuard: true,
      useFactory: () => ({
        auth,
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
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new JwksGuard(reflector),
      inject: [Reflector],
    },
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new RbacGuard(reflector),
      inject: [Reflector],
    },
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new OrgRbacGuard(reflector),
      inject: [Reflector],
    },
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new RolesGuard(reflector),
      inject: [Reflector],
    },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
  ],
})
export class AppModule {}
