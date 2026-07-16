import { env } from "@workspace/config"

export function isSentryEnabled(): boolean {
  return env.SENTRY_DSN.length > 0 && env.NODE_ENV === "production"
}

export function isOtelEnabled(): boolean {
  return (
    env.OTEL_EXPORTER_OTLP_ENDPOINT.length > 0 && env.NODE_ENV === "production"
  )
}
