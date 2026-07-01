import type {
  BetterAuthClientOptions,
  InferSessionFromClient,
  InferUserFromClient,
} from "better-auth/client"
import type { PlatformRoleName } from "../config/admin-plugin"
import type { JwtPayload } from "../config/jwt"
import type { AuthClient } from "../lib/auth-client"

export type { PlatformRoleName }

type AuthClientOptions =
  AuthClient extends import("better-auth/client").AuthClient<
    infer Options extends BetterAuthClientOptions
  >
    ? Options
    : never

export type AuthUser = InferUserFromClient<AuthClientOptions>
export type AuthSession = InferSessionFromClient<AuthClientOptions>

export type JwtClaims = JwtPayload & {
  sub?: string
  iss?: string
  aud?: string | string[]
  exp?: number
  iat?: number
}
