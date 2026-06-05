import { createAuthClient } from "better-auth/react"
import { parseClientPublicEnv } from "@repo/config/client"
import { authClientPlugins } from "./plugins/client"

function getBearerTokenKey(source: Record<string, string | undefined>): string {
  const { bearerTokenKey } = parseClientPublicEnv(source)
  return bearerTokenKey
}

function getBearerToken(key: string): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem(key) || ""
}

function setBearerToken(key: string, token: string | null) {
  if (typeof window === "undefined") return
  if (token) {
    localStorage.setItem(key, token)
  } else {
    localStorage.removeItem(key)
  }
}

/** Create the Better Auth React client. Pass `import.meta.env` (Vite) or `process.env` (Next.js). */
export function createAppAuthClient(
  source: Record<string, string | undefined>
) {
  const { apiUrl } = parseClientPublicEnv(source)
  const baseURL = `${apiUrl.replace(/\/+$/, "")}/api/auth`
  const bearerTokenKey = getBearerTokenKey(source)

  return createAuthClient({
    baseURL,
    plugins: authClientPlugins,
    fetchOptions: {
      auth: {
        type: "Bearer",
        token: () => getBearerToken(bearerTokenKey),
      },
      onSuccess: (ctx) => {
        const token = ctx.response.headers.get("set-auth-token")
        if (token) setBearerToken(bearerTokenKey, token)
      },
      onError: (ctx) => {
        if (ctx.response.status === 401) setBearerToken(bearerTokenKey, null)
      },
    },
  })
}
