import * as Sentry from "@sentry/react"

function getSentryDsn(): string | undefined {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  return typeof dsn === "string" && dsn.length > 0 ? dsn : undefined
}

export function isSentryEnabled(): boolean {
  return import.meta.env.PROD && getSentryDsn() !== undefined
}

export function initSentry(): void {
  const dsn = getSentryDsn()
  if (!import.meta.env.PROD || !dsn) return

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
  })
}

export function captureException(
  error: unknown,
  context?: { componentStack?: string | null }
): void {
  if (!isSentryEnabled()) return

  Sentry.captureException(error, {
    contexts: context?.componentStack
      ? { react: { componentStack: context.componentStack } }
      : undefined,
  })
}
