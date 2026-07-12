import "module-alias/register"

import { NestFactory } from "@nestjs/core"
import { env } from "@workspace/config"
import { createLogger } from "@workspace/logger"
import { NestLoggerService } from "@workspace/logger/nest"
import { AppModule } from "./app.module"
import { configureApp } from "./common/configure-app"

async function bootstrap() {
  const logger = createLogger("Bootstrap")

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  })

  app.useLogger(new NestLoggerService())
  configureApp(app)
  app.enableShutdownHooks()

  await app.listen(env.PORT)

  logger.info({ port: env.PORT }, "API listening")
  if (env.NODE_ENV !== "production") {
    logger.info({ path: "/docs" }, "Swagger docs available")
  }
}

bootstrap().catch((error: unknown) => {
  createLogger("Bootstrap").error(
    { err: error instanceof Error ? error : { message: String(error) } },
    "Failed to start API"
  )
  process.exit(1)
})
