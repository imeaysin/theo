/** Returns true when the JWT payload `exp` is in the past (with optional skew). */
export function isJwtExpired(token: string, skewSeconds = 30): boolean {
  try {
    const segment = token.split(".")[1]
    if (!segment) return true

    const payload = JSON.parse(
      atob(segment.replace(/-/g, "+").replace(/_/g, "/"))
    ) as { exp?: unknown }

    if (typeof payload.exp !== "number") return false

    return payload.exp * 1000 <= Date.now() + skewSeconds * 1000
  } catch {
    return true
  }
}
