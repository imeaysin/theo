const UNSAFE_PREFIXES = ["//", "/\\", "http:", "https:", "javascript:", "data:"]

/** Returns a same-app relative path safe for post-auth navigation. */
export function getSafeRedirectPath(
  redirect: string | null | undefined,
  fallback: string
): string {
  if (!redirect) return fallback

  const path = redirect.trim()
  if (!path.startsWith("/")) return fallback
  if (UNSAFE_PREFIXES.some((prefix) => path.toLowerCase().startsWith(prefix))) {
    return fallback
  }
  if (path.includes("\\")) return fallback

  return path
}

/** Post-auth landing path — invitation links only; everything else uses fallback. */
export function resolvePostAuthRedirectPath(options: {
  redirect: string | null | undefined
  fallback: string
  invitationPath: string
}): string {
  const safeRedirect = getSafeRedirectPath(options.redirect, options.fallback)
  if (safeRedirect.startsWith(options.invitationPath)) {
    return safeRedirect
  }

  return options.fallback
}

/** Appends `?redirect=` when returning to an auth page should preserve post-login navigation. */
export function withAuthRedirectQuery(
  path: string,
  options: {
    redirect?: string | null
    fallback: string
  }
): string {
  const safeRedirect = getSafeRedirectPath(options.redirect, options.fallback)
  if (safeRedirect === options.fallback) return path

  return `${path}?redirect=${encodeURIComponent(safeRedirect)}`
}
