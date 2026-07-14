import { VersioningType } from "@nestjs/common"
import type { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { cleanupOpenApiDoc } from "nestjs-zod"
import { createLogger } from "@workspace/logger"
import { storageEnv, resolveStorageLocalPath } from "@workspace/config/storage"

import compression from "compression"
import express from "express"
import helmet from "helmet"
import { env } from "@workspace/config"
import { applyRateLimit } from "./middleware/rate-limit.middleware"
import { applyRequestContext } from "./middleware/request-context.middleware"

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

function applyTrustProxy(app: INestApplication) {
  if (env.NODE_ENV !== "production") return

  app.getHttpAdapter().getInstance().set("trust proxy", 1)
}

function applySwagger(app: INestApplication) {
  if (env.NODE_ENV === "production") return

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${env.APP_NAME} API`)
    .setDescription(
      "Business REST API. Auth routes are served at /api/auth. Successful JSON responses use the `{ success, statusCode, message, data, timestamp }` envelope; failures return `{ success, statusCode, code, message, errors, path, timestamp }`."
    )
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "bearer"
    )
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("docs", app, cleanupOpenApiDoc(document))

  createLogger("ConfigureApp").info("Swagger available at /docs")
}

function applyLocalUploads(app: INestApplication) {
  if (storageEnv.STORAGE_PROVIDER !== "local") return

  app.use("/uploads", express.static(resolveStorageLocalPath()))
}

/** Shared bootstrap used by `main.ts` and e2e tests. */
export function configureApp(app: INestApplication) {
  applyRequestContext(app)
  applyRateLimit(app, {
    enabled: env.RATE_LIMIT_ENABLED,
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  })
  applySecurity(app)
  applyCors(app)
  applyVersioning(app)
  applyTrustProxy(app)
  applyLocalUploads(app)
  applySwagger(app)
}
