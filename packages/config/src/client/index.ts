import { z } from "zod"
import { clientDefaults } from "../constants"

const webClientSchema = z.object({
  VITE_API_URL: z.string().url().optional(),
  VITE_AUTH_URL: z.string().url().optional(),
  VITE_APP_NAME: z.string().min(1).optional(),
  VITE_MARKETING_URL: z.string().url().optional(),
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

export type ClientPublicEnv = {
  apiUrl: string
  authUrl: string
  appName: string
  marketingUrl: string
}

function resolveClientUrls(
  source: Record<string, string | undefined>
): ClientPublicEnv {
  const apiUrl =
    source.VITE_API_URL ??
    source.NEXT_PUBLIC_API_URL ??
    source.EXPO_PUBLIC_API_URL ??
    defaultApiUrl

  const authUrl =
    source.VITE_AUTH_URL ??
    source.NEXT_PUBLIC_AUTH_URL ??
    source.EXPO_PUBLIC_AUTH_URL ??
    apiUrl

  const appName =
    source.VITE_APP_NAME ??
    source.NEXT_PUBLIC_APP_NAME ??
    source.EXPO_PUBLIC_APP_NAME ??
    defaultAppName

  const marketingUrl = source.VITE_MARKETING_URL ?? defaultMarketingUrl

  return { apiUrl, authUrl, appName, marketingUrl }
}

/** `apps/web` (Vite) — pass `import.meta.env`. */
export function parseWebEnv(
  source: Record<string, string | undefined>
): ClientPublicEnv {
  webClientSchema.parse(source)
  return resolveClientUrls(source)
}

export { clientDefaults, DEFAULT_APP_NAME, DEV_URLS } from "../constants"

/** `apps/marketing` (Next.js) — pass `process.env`. */
export function parseMarketingEnv(
  source: Record<string, string | undefined> = process.env
): ClientPublicEnv {
  marketingClientSchema.parse(source)
  return resolveClientUrls(source)
}

/** `apps/mobile` (Expo) — pass `process.env`. */
export function parseMobileEnv(
  source: Record<string, string | undefined> = process.env
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
 * Safe in the browser — does not reference `process` when it is unavailable.
 */
export function getClientPublicEnvSource(): Record<string, string | undefined> {
  const source: Record<string, string | undefined> = {}

  const viteEnv = import.meta as ImportMeta & {
    env?: Record<string, string | undefined>
  }
  if (viteEnv.env) {
    source.VITE_API_URL = viteEnv.env.VITE_API_URL
    source.VITE_AUTH_URL = viteEnv.env.VITE_AUTH_URL
    source.VITE_APP_NAME = viteEnv.env.VITE_APP_NAME
    source.VITE_MARKETING_URL = viteEnv.env.VITE_MARKETING_URL
  }

  if (typeof process !== "undefined") {
    source.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL
    source.NEXT_PUBLIC_AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL
    source.NEXT_PUBLIC_APP_NAME = process.env.NEXT_PUBLIC_APP_NAME
    source.EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL
    source.EXPO_PUBLIC_AUTH_URL = process.env.EXPO_PUBLIC_AUTH_URL
    source.EXPO_PUBLIC_APP_NAME = process.env.EXPO_PUBLIC_APP_NAME
  }

  return source
}
