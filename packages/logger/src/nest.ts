import type { LoggerService } from "@nestjs/common"
import { createLogger } from "./index"

function formatMessage(message: unknown): string {
  if (typeof message === "string") return message
  if (message instanceof Error) return message.message
  try {
    return JSON.stringify(message)
  } catch {
    return String(message)
  }
}

/** Routes NestJS framework logs through `@workspace/logger` (pino). */
export class NestLoggerService implements LoggerService {
  log(message: unknown, context?: string): void {
    createLogger(context ?? "Nest").info(formatMessage(message))
  }

  error(message: unknown, stack?: string, context?: string): void {
    const logger = createLogger(context ?? "Nest")
    const err = message instanceof Error ? message : undefined
    logger.error(
      {
        err,
        stack: stack ?? err?.stack,
      },
      formatMessage(message)
    )
  }

  warn(message: unknown, context?: string): void {
    createLogger(context ?? "Nest").warn(formatMessage(message))
  }

  debug(message: unknown, context?: string): void {
    createLogger(context ?? "Nest").debug(formatMessage(message))
  }

  verbose(message: unknown, context?: string): void {
    createLogger(context ?? "Nest").trace(formatMessage(message))
  }

  fatal(message: unknown, context?: string): void {
    createLogger(context ?? "Nest").fatal(formatMessage(message))
  }

  setLogLevels(_levels: unknown): void {
    // Level is controlled by LOG_LEVEL / NODE_ENV on the root pino instance.
  }
}
