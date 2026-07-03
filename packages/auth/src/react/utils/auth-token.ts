import type { AuthClient } from "../../lib/auth-client"
import { DEFAULT_JWT_STORAGE_KEY } from "../../lib/constants"
import { unwrapClientResult } from "./client-call"
import { isJwtExpired } from "./jwt-expiry"

export { DEFAULT_JWT_STORAGE_KEY }

export function clearStoredAuthJwt(jwtStorageKey = DEFAULT_JWT_STORAGE_KEY) {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(jwtStorageKey)
  }
}

export async function refreshAuthToken(
  client: AuthClient,
  jwtStorageKey = DEFAULT_JWT_STORAGE_KEY
) {
  clearStoredAuthJwt(jwtStorageKey)
  return unwrapClientResult(client.token())
}

export async function getBearerToken(
  client: AuthClient,
  jwtStorageKey = DEFAULT_JWT_STORAGE_KEY,
  options?: { forceRefresh?: boolean }
): Promise<string | null> {
  if (!options?.forceRefresh && typeof sessionStorage !== "undefined") {
    const cached = sessionStorage.getItem(jwtStorageKey)
    if (cached && !isJwtExpired(cached)) return cached
    if (cached) sessionStorage.removeItem(jwtStorageKey)
  } else if (options?.forceRefresh) {
    try {
      const refreshed = await refreshAuthToken(client, jwtStorageKey)
      return refreshed?.token ?? null
    } catch {
      return null
    }
  }

  const { data, error } = await client.token()
  if (error || !data?.token) return null

  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(jwtStorageKey, data.token)
  }

  return data.token
}
