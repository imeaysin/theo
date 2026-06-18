export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  emailVerified: boolean
  image: null
  role?: string
}

export interface AccessTokenClaims {
  sub: string
  id?: string
  email?: string
  name?: string
  role?: string
  emailVerified?: boolean
}

export function getUserRole(user: Record<string, unknown>): string | undefined {
  const role = user.role
  return typeof role === "string" ? role : undefined
}

export function accessTokenClaimsToUser(
  claims: AccessTokenClaims
): AuthenticatedUser {
  return {
    id: claims.id ?? claims.sub,
    email: claims.email ?? "",
    name: claims.name ?? "",
    emailVerified: Boolean(claims.emailVerified),
    image: null,
    role: claims.role,
  }
}
