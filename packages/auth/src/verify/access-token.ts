import type { AccessTokenClaims } from "./claims"
import { env } from "@workspace/config"
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose"

let cachedJwks: ReturnType<typeof createRemoteJWKSet> | null = null

function getJwks(): ReturnType<typeof createRemoteJWKSet> {
  if (!cachedJwks) {
    const jwksUrl = new URL("/api/auth/jwks", env.BETTER_AUTH_URL)
    cachedJwks = createRemoteJWKSet(jwksUrl)
  }
  return cachedJwks
}

function parseAccessTokenClaims(payload: JWTPayload): AccessTokenClaims | null {
  if (typeof payload.sub !== "string") return null

  const claims: AccessTokenClaims = { sub: payload.sub }

  if (typeof payload.id === "string") claims.id = payload.id
  if (typeof payload.email === "string") claims.email = payload.email
  if (typeof payload.name === "string") claims.name = payload.name
  if (typeof payload.role === "string") claims.role = payload.role
  if (typeof payload.emailVerified === "boolean") {
    claims.emailVerified = payload.emailVerified
  }

  return claims
}

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenClaims | null> {
  const bearer = token.startsWith("Bearer ") ? token.slice(7) : token
  if (!bearer) return null

  try {
    const { payload } = await jwtVerify(bearer, getJwks(), {
      issuer: env.BETTER_AUTH_URL,
      audience: env.BETTER_AUTH_URL,
    })

    return parseAccessTokenClaims(payload)
  } catch {
    return null
  }
}
