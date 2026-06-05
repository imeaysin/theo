import { createAppAuthClient } from "@repo/auth/client"

/**
 * Auth Client Instance
 *
 * Central authentication client for the application.
 * DO NOT use directly in components - use hooks from @/features/auth/hooks instead.
 *
 * This client is only imported by feature-level hooks to configure better-auth-ui.
 */
export const authClient = createAppAuthClient(import.meta.env)
