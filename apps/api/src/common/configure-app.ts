import { Logger, ValidationPipe, VersioningType } from "@nestjs/common"
import type { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import compression from "compression"
import helmet from "helmet"
import { env } from "@workspace/config"

function applySecurity(app: INestApplication) {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  )
  app.use(compression())
}

function applyCors(app: INestApplication) {
  const origins = env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())

  app.enableCors({ origin: origins, credentials: true })
}

function applyVersioning(app: INestApplication) {
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  })
}

function applyValidation(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  )
}

function applyTrustProxy(app: INestApplication) {
  if (env.NODE_ENV !== "production") return

  app.getHttpAdapter().getInstance().set("trust proxy", 1)
}

function applySwagger(app: INestApplication) {
  if (env.NODE_ENV === "production") return

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${env.APP_NAME} API`)
    .setDescription("Business API — auth routes are served at /api/auth")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "bearer"
    )
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("docs", app, document)

  Logger.log("Swagger available at /docs", "ConfigureApp")
}

/** Shared bootstrap used by `main.ts` and e2e tests. */
export function configureApp(app: INestApplication) {
  applySecurity(app)
  applyCors(app)
  applyVersioning(app)
  applyValidation(app)
  applyTrustProxy(app)
  applySwagger(app)
}
