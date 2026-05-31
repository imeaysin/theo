/** Strip trailing slashes. */
export function trimTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, "")
}

/**
 * Ensures the client targets the Nest global prefix (default `/api`).
 * `http://localhost:4000` → `http://localhost:4000/api`
 */
export function normalizeApiBaseUrl(
  baseUrl: string,
  apiPrefix = "/api"
): string {
  const origin = trimTrailingSlashes(baseUrl)
  const prefix = apiPrefix.startsWith("/") ? apiPrefix : `/${apiPrefix}`

  if (origin.endsWith(prefix)) return origin
  return `${origin}${prefix}`
}

/**
 * Resolve API base URL for web tooling. Mobile apps should pass `baseUrl` explicitly.
 */
export function resolveApiBaseUrl(explicit?: string): string {
  if (explicit) return normalizeApiBaseUrl(explicit)

  const fromEnv =
    readEnv("VITE_API_URL") ??
    readEnv("EXPO_PUBLIC_API_URL") ??
    readEnv("NEXT_PUBLIC_API_URL")

  if (fromEnv) return normalizeApiBaseUrl(fromEnv)

  return normalizeApiBaseUrl("http://localhost:4000")
}

function readEnv(key: string): string | undefined {
  const env = (
    globalThis as { process?: { env?: Record<string, string | undefined> } }
  ).process?.env
  const value = env?.[key]
  return value && value.length > 0 ? value : undefined
}
