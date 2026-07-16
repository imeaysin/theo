export const MAXIMUM_ROLES_PER_ORGANIZATION = 20 as const
export const MAXIMUM_TEAMS_PER_ORGANIZATION = 10 as const
export const AUTH_BASE_PATH = "/api/auth" as const
export const NATIVE_APP_SCHEME = "theo" as const
export const NATIVE_STORAGE_PREFIX = "theo" as const
export const WEB_TWO_FACTOR_PATH = "/auth/two-factor" as const
export const WEB_ACCEPT_INVITATION_PATH_PREFIX = "/accept-invitation" as const

/** Session lifetime (cookie + DB row). Default Better Auth: 7 days. */
export const SESSION_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7
/** How often an active session extends `expiresAt`. Default: 1 day. */
export const SESSION_UPDATE_AGE_SECONDS = 60 * 60 * 24
