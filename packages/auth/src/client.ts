import { createAuthClient } from "better-auth/react"
import { authClientPlugins } from "./plugins/client"

/** Create the Better Auth React client. Pass `resolveAuthBaseUrl(import.meta.env)` from the app. */
export function createAppAuthClient(baseURL: string) {
  return createAuthClient({
    baseURL,
    plugins: authClientPlugins,
  })
}
