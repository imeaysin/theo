import pino, { type Logger, type LoggerOptions } from "pino"
import { z } from "zod"

const loggerEnvSchema = z.object({
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  LOG_PRETTY: z.enum(["true", "false"]).optional(),
  CI: z.string().optional(),
  JEST_WORKER_ID: z.string().optional(),
  NODE_ENV: z.string().optional(),
})

const env = loggerEnvSchema.parse({
  LOG_LEVEL: process.env.LOG_LEVEL?.trim(),
  LOG_PRETTY: process.env.LOG_PRETTY?.trim(),
  CI: process.env.CI?.trim(),
  JEST_WORKER_ID: process.env.JEST_WORKER_ID?.trim(),
  NODE_ENV: process.env.NODE_ENV?.trim(),
})

/** Nest internals that spam the console on every boot — kept at debug. */
const NEST_VERBOSE_CONTEXTS = new Set([
  "InstanceLoader",
  "RoutesResolver",
  "RouterExplorer",
  "NestFactory",
])

function resolveLogLevel(): pino.LevelWithSilent {
  return env.LOG_LEVEL as pino.LevelWithSilent
}

function isPrettyEnabled(): boolean {
  if (env.LOG_PRETTY === "true") return true
  if (env.LOG_PRETTY === "false") return false
  if (env.CI === "true") return false
  if (env.JEST_WORKER_ID !== undefined) return false
  return env.NODE_ENV === "development"
}

function createRootLogger(): Logger {
  const level = resolveLogLevel()

  if (isPrettyEnabled()) {
    // https://getpino.io/#/docs/pretty — transport loads pino-pretty in a worker thread (development only)
    return pino({
      level,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
          singleLine: true,
          messageFormat: "{if name}[{name}] {end}{msg}",
        },
      },
    })
  }

  const options: LoggerOptions = {
    level,
    // ISO timestamps; structured JSON for production / log aggregators
    timestamp: pino.stdTimeFunctions.isoTime,
  }

  return pino(options)
}

const root = createRootLogger()

/** Named child logger for a module or context. */
export function createLogger(name: string): Logger {
  return root.child({ name })
}

export function isNestVerboseContext(context?: string): boolean {
  return context != null && NEST_VERBOSE_CONTEXTS.has(context)
}

export type { Logger }
export { root as logger }
export {
  getRequestContext,
  getRequestId,
  runWithRequestContext,
  type RequestContext,
} from "./context"
