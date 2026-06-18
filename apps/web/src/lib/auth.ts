import {
  createAppAuthClient,
  createWebTokenStorage,
} from "@workspace/auth/client"

const tokenStorage = createWebTokenStorage()

/**
 * Auth Client Instance
 *
 * Central authentication client for the application.
 * DO NOT use directly in components - use hooks from @/features/auth/hooks instead.
 *
 * Uses Bearer tokens + JWT (no cookie sessions).
 */
export const authClient = createAppAuthClient(import.meta.env, tokenStorage)

export { tokenStorage }
