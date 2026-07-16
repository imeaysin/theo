import * as Sentry from "@sentry/nestjs"
import { env } from "@workspace/config"
import { isSentryEnabled } from "./enabled"

export function initSentry(): void {
  if (!isSentryEnabled()) return

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: 0.1,
  })
}
