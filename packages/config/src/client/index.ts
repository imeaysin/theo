import { z } from "zod"
import { clientDefaults } from "../constants"

const optionalPublicUrl = z.union([z.literal(""), z.string().url()]).optional()

const optionalSentryDsn = z.union([z.literal(""), z.string().url()]).optional()

const webClientSchema = z.object({
  VITE_API_URL: optionalPublicUrl,
  VITE_AUTH_URL: optionalPublicUrl,
  VITE_APP_NAME: z.string().min(1).optional(),
  VITE_MARKETING_URL: z.string().url().optional(),
  VITE_SENTRY_DSN: optionalSentryDsn,
})

const marketingClientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_AUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).optional(),
})

const mobileClientSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url().optional(),
  EXPO_PUBLIC_AUTH_URL: z.string().url().optional(),
  EXPO_PUBLIC_APP_NAME: z.string().min(1).optional(),
})

const defaultApiUrl = clientDefaults.apiUrl
const defaultAppName = clientDefaults.appName
const defaultMarketingUrl = clientDefaults.marketingUrl

const PROCESS_ENV_KEYS = [
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_AUTH_URL",
  "NEXT_PUBLIC_APP_NAME",
  "EXPO_PUBLIC_API_URL",
  "EXPO_PUBLIC_AUTH_URL",
  "EXPO_PUBLIC_APP_NAME",
] as const

export type ClientPublicEnv = {
  apiUrl: string
  authUrl: string
  appName: string
  marketingUrl: string
}

function resolveClientUrls(
  source: Record<string, string | undefined>
): ClientPublicEnv {
  const useProxy = shouldUseViteDevProxy()
  const configuredApi =
    source.VITE_API_URL ??
    source.NEXT_PUBLIC_API_URL ??
    source.EXPO_PUBLIC_API_URL

  const apiUrl = useProxy ? "" : (configuredApi ?? defaultApiUrl)

  const configuredAuth =
    source.VITE_AUTH_URL ??
    source.NEXT_PUBLIC_AUTH_URL ??
    source.EXPO_PUBLIC_AUTH_URL

  const authUrl = useProxy ? "" : (configuredAuth ?? apiUrl)

  const appName =
    source.VITE_APP_NAME ??
    source.NEXT_PUBLIC_APP_NAME ??
    source.EXPO_PUBLIC_APP_NAME ??
    defaultAppName

  const marketingUrl = source.VITE_MARKETING_URL ?? defaultMarketingUrl

  return { apiUrl, authUrl, appName, marketingUrl }
}

function readEnvRecordValue(
  envRecord: object,
  key: string
): string | undefined {
  const value = Reflect.get(envRecord, key)
  return typeof value === "string" ? value : undefined
}

function readProcessEnvValue(key: string): string | undefined {
  const processRef = Reflect.get(globalThis, "process")
  if (!processRef || typeof processRef !== "object") return undefined
  const env = Reflect.get(processRef, "env")
  if (!env || typeof env !== "object") return undefined
  return readEnvRecordValue(env, key)
}

function readViteEnvValue(key: string): string | undefined {
  const viteEnv = Reflect.get(import.meta, "env")
  if (!viteEnv || typeof viteEnv !== "object") return undefined
  return readEnvRecordValue(viteEnv, key)
}

function shouldUseViteDevProxy(): boolean {
  const viteMeta = Reflect.get(import.meta, "env")
  if (!viteMeta || typeof viteMeta !== "object") return false
  if (Reflect.get(viteMeta, "DEV") !== true) return false
  return Reflect.get(viteMeta, "VITE_DEV_PROXY") !== "false"
}

function readVitePublicUrl(key: string): string | undefined {
  if (shouldUseViteDevProxy()) return ""
  return readViteEnvValue(key)
}

/** `apps/web` (Vite) — pass `import.meta.env`. */
export function parseWebEnv(
  source: Record<string, string | undefined>
): ClientPublicEnv {
  webClientSchema.parse(source)
  return resolveClientUrls(source)
}

export {
  clientDefaults,
  DEFAULT_APP_NAME,
  DEV_URLS,
  DEV_ALLOWED_ORIGINS,
} from "../constants"

/** `apps/marketing` (Next.js) — pass `process.env` from the app. */
export function parseMarketingEnv(
  source: Record<string, string | undefined>
): ClientPublicEnv {
  marketingClientSchema.parse(source)
  return resolveClientUrls(source)
}

/** `apps/mobile` (Expo) — pass `process.env` from the app. */
export function parseMobileEnv(
  source: Record<string, string | undefined>
): ClientPublicEnv {
  mobileClientSchema.parse(source)
  return resolveClientUrls(source)
}

/**
 * Generic client env parser — used by shared packages (`@workspace/auth/client`).
 * Prefer app-specific parsers in application code when possible.
 */
export function parseClientPublicEnv(
  source: Record<string, string | undefined>
): ClientPublicEnv {
  return resolveClientUrls(source)
}

/**
 * Collect public env vars from the current runtime (Vite, Next.js, Expo).
 * Never touches the bare `process` identifier (unsafe in Vite browser bundles).
 */
export function getClientPublicEnvSource(): Record<string, string | undefined> {
  const source: Record<string, string | undefined> = {
    VITE_API_URL: readVitePublicUrl("VITE_API_URL"),
    VITE_AUTH_URL: readVitePublicUrl("VITE_AUTH_URL"),
    VITE_APP_NAME: readViteEnvValue("VITE_APP_NAME"),
    VITE_MARKETING_URL: readViteEnvValue("VITE_MARKETING_URL"),
  }

  for (const key of PROCESS_ENV_KEYS) {
    source[key] = readProcessEnvValue(key)
  }

  return source
}
