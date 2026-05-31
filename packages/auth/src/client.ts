import { createAuthClient } from "better-auth/client"
import { adminClient } from "better-auth/client/plugins"
import { twoFactorClient } from "better-auth/client/plugins"
import { organizationClient } from "better-auth/client/plugins"
import { ac, admin, user } from "./permissions"

function resolveBaseURL(): string {
  const viteUrl = process.env?.VITE_API_URL
  if (viteUrl) return `${viteUrl}/api/auth`

  const nextUrl = process.env?.NEXT_PUBLIC_API_URL
  if (nextUrl) return `${nextUrl}/api/auth`

  if (typeof window !== "undefined") return "http://localhost:4000/api/auth"

  return "http://localhost:4000/api/auth"
}

export const authClient = createAuthClient({
  baseURL: resolveBaseURL(),
  plugins: [
    adminClient({ ac, roles: { admin, user } }),
    twoFactorClient(),
    organizationClient(),
  ],
})
