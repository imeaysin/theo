import { createAuthClient } from "better-auth/react"
import { parseClientPublicEnv } from "@repo/config/client"
import { authClientPlugins } from "./plugins/client"

export function createAppAuthClient(
  source: Record<string, string | undefined>
) {
  const { apiUrl, bearerTokenKey } = parseClientPublicEnv(source)
  const baseURL = `${apiUrl.replace(/\/+$/, "")}/api/auth`

  const getBearerToken = (): string => {
    if (typeof window === "undefined") return ""
    return localStorage.getItem(bearerTokenKey) ?? ""
  }

  const setBearerToken = (token: string | null): void => {
    if (typeof window === "undefined") return
    if (token) localStorage.setItem(bearerTokenKey, token)
    else localStorage.removeItem(bearerTokenKey)
  }

  return createAuthClient({
    baseURL,
    plugins: authClientPlugins,
    fetchOptions: {
      auth: {
        type: "Bearer",
        token: getBearerToken,
      },
      onSuccess: (ctx) => {
        const token = ctx.response.headers.get("set-auth-token")
        if (token) setBearerToken(token)
      },
      onError: (ctx) => {
        if (ctx.response.status === 401) setBearerToken(null)
      },
    },
  })
}
