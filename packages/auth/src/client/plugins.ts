import { adminClient, jwtClient } from "better-auth/client/plugins"
import { ac, admin, user } from "../authorization"
import type { TokenStorage } from "./token-storage"

export const authClientPlugins = [
  adminClient({ ac, roles: { admin, user } }),
  jwtClient(),
]

export function createBearerFetchOptions(tokenStorage: TokenStorage) {
  return {
    auth: {
      type: "Bearer" as const,
      token: () => tokenStorage.getBearerToken() ?? "",
    },
    onSuccess: (ctx: { response: Response }) => {
      const bearerToken = ctx.response.headers.get("set-auth-token")
      if (bearerToken) {
        tokenStorage.setBearerToken(bearerToken)
      }

      const accessToken = ctx.response.headers.get("set-auth-jwt")
      if (accessToken) {
        tokenStorage.setAccessToken(accessToken)
      }
    },
  }
}
