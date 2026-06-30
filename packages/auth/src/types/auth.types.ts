export interface JWTClaims {
  id: string
  email: string
  role: RoleName
  name: string
  activeOrganizationId?: string | null
  /** Member role(s) in the active organization — set when the JWT is minted. */
  organizationRole?: string | null
  sub?: string
  iss?: string
  aud?: string | string[]
  exp?: number
  iat?: number
}

export type RoleName = "guest" | "user" | "manager" | "admin"

export interface AuthUser {
  id: string
  email: string
  name: string
  role: RoleName
  emailVerified: boolean
  image?: string | null
}

export type AppRole = RoleName
