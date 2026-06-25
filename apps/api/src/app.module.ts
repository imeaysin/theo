import { Module } from "@nestjs/common"
import { APP_FILTER, APP_GUARD, Reflector } from "@nestjs/core"
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { AuthModule } from "@thallesp/nestjs-better-auth"
import { auth } from "@workspace/auth"
import { JwksGuard } from "@workspace/auth/nestjs"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter"
import { DatabaseModule, DATABASE_READY } from "./infrastructure/database/database.module"
import { HealthModule } from "./modules/health/health.module"
import { MeModule } from "./modules/me/me.module"

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    MeModule,
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
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
