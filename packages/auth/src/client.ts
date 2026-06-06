import { createAuthClient } from "better-auth/react"
import { parseClientPublicEnv } from "@workspace/config/client"
import { authClientPlugins } from "./plugins/client"

export function createAppAuthClient(
  source: Record<string, string | undefined>
) {
  const { apiUrl } = parseClientPublicEnv(source)
  const baseURL = `${apiUrl.replace(/\/+$/, "")}/api/auth`

  return createAuthClient({
    baseURL,
    plugins: authClientPlugins,
  })
}
