import type { IncomingHttpHeaders } from "http"
import {
  accessTokenClaimsToUser,
  type AccessTokenClaims,
  type AuthenticatedUser,
} from "../verify/claims"
import { verifyAccessToken } from "../verify/access-token"

export interface AuthContext {
  user: AuthenticatedUser
  claims: AccessTokenClaims
}

export async function getAuthFromHeaders(
  nodeHeaders: IncomingHttpHeaders
): Promise<AuthContext | null> {
  const authorization = nodeHeaders.authorization
  if (!authorization?.startsWith("Bearer ")) return null

  const claims = await verifyAccessToken(authorization)
  if (!claims) return null

  return {
    user: accessTokenClaimsToUser(claims),
    claims,
  }
}
