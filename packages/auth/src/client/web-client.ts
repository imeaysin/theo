import { createAuthClient } from "better-auth/react"
import { parseClientPublicEnv } from "@workspace/config/client"
import { authClientPlugins, createBearerFetchOptions } from "./plugins"
import type { TokenStorage } from "./token-storage"

export function createAppAuthClient(
  source: Record<string, string | undefined>,
  tokenStorage: TokenStorage
) {
  const { apiUrl } = parseClientPublicEnv(source)
  const baseURL =
    typeof window !== "undefined"
      ? "/api/auth"
      : `${apiUrl.replace(/\/+$/, "")}/api/auth`

  return createAuthClient({
    baseURL,
    plugins: authClientPlugins,
    fetchOptions: {
      ...createBearerFetchOptions(tokenStorage),
      credentials: "include",
    },
  })
}

export type AppAuthClient = ReturnType<typeof createAppAuthClient>
