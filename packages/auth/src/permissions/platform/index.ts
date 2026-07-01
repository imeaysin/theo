import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"
import { businessStatement } from "../business/statement"
import { platformGrants } from "../business/grants"
import type {
  ActionName,
  PermissionMapFor,
  RequiredPermission,
  ResourceName,
} from "../types"

export const statement = {
  ...defaultStatements,
  ...businessStatement,
  team: ["invite", "remove", "update-role"] as const,
} as const

export type PlatformStatement = typeof statement
export type PlatformResource = ResourceName<PlatformStatement>
export type PlatformAction<R extends PlatformResource> = ActionName<
  PlatformStatement,
  R
>
export type PlatformPermissionMap = PermissionMapFor<PlatformStatement>
export type PlatformRequiredPermission<
  R extends PlatformResource = PlatformResource,
> = RequiredPermission<PlatformStatement, R>

export const ac = createAccessControl(statement)

export const guestRole = ac.newRole(platformGrants.guest)

export const userRole = ac.newRole({
  ...adminAc.statements,
  ...platformGrants.user,
})

export const managerRole = ac.newRole({
  ...userRole.statements,
  ...platformGrants.manager,
  team: ["invite", "remove"],
})

export const adminRole = ac.newRole({
  ...adminAc.statements,
  ...platformGrants.owner,
  team: ["invite", "remove", "update-role"],
})

export const platformRoles = {
  guest: guestRole,
  user: userRole,
  manager: managerRole,
  admin: adminRole,
} as const

export function checkPlatformPermission<R extends PlatformResource>(
  platformRole: string,
  resource: R,
  action: PlatformAction<R>
): boolean {
  const role = platformRoles[platformRole as keyof typeof platformRoles]
  if (!role) return false

  return role.authorize({ [resource]: [action] }).success
}
