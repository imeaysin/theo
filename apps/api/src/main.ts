import { Logger } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { env } from "@workspace/config"
import { AppModule } from "./app.module"
import { configureApp } from "./common/configure-app"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  })

  const logger = new Logger("Bootstrap")
  app.useLogger(logger)

  configureApp(app)
  app.enableShutdownHooks()

  await app.listen(env.PORT)

  logger.log(`API listening on http://localhost:${env.PORT}`)
  if (env.NODE_ENV !== "production") {
    logger.log(`Swagger docs at http://localhost:${env.PORT}/docs`)
  }
}

bootstrap().catch((error: unknown) => {
  const logger = new Logger("Bootstrap")
  logger.error("Failed to start API", error instanceof Error ? error.stack : error)
  process.exit(1)
})
