import { createAppAuthClient } from "@repo/auth/client"
import { resolveAuthBaseUrl } from "@repo/config/client"

export const authClient = createAppAuthClient(
  resolveAuthBaseUrl(import.meta.env)
)

export const { signIn, signUp, signOut, useSession, getSession } = authClient
