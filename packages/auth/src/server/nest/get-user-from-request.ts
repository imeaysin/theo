import type { AuthorizableUser } from "nest-casl"
import { Roles } from "../../access"

type SessionUser = {
  readonly id: string
  readonly role?: string | string[]
}

type SessionPayload = {
  readonly activeOrganizationId?: string | null
}

type AuthRequest = {
  readonly user?: SessionUser
  readonly session?: SessionPayload & {
    readonly user?: SessionUser
  }
}

const ROLE_VALUES = new Set<string>(Object.values(Roles))

function isRole(value: string): value is Roles {
  return ROLE_VALUES.has(value)
}

function normalizeRoleList(role: string | string[] | undefined): Roles[] {
  if (!role) return []
  const values = Array.isArray(role) ? role : role.split(",")
  return values.map((value) => value.trim()).filter(isRole)
}

export function getUserFromRequest(
  request: AuthRequest
): AuthorizableUser<Roles, string> | undefined {
  const user = request.user ?? request.session?.user
  if (!user) return undefined

  return {
    id: user.id,
    roles: normalizeRoleList(user.role),
  }
}
