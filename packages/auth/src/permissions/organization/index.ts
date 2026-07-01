import { createAccessControl } from "better-auth/plugins/access"
import {
  ownerAc,
  adminAc,
  memberAc,
} from "better-auth/plugins/organization/access"
import { organizationGrants } from "../business/grants"
import type {
  ActionName,
  PermissionMapFor,
  RequiredPermission,
  ResourceName,
} from "../types"
import { statement, type OrganizationStatement } from "./statement"

export { statement, type OrganizationStatement } from "./statement"

export type OrganizationResource = ResourceName<OrganizationStatement>
export type OrganizationAction<R extends OrganizationResource> = ActionName<
  OrganizationStatement,
  R
>
export type OrganizationPermissionMap = PermissionMapFor<OrganizationStatement>
export type OrganizationPermissionCheck = {
  permissions: OrganizationPermissionMap
}
export type OrganizationRequiredPermission<
  R extends OrganizationResource = OrganizationResource,
> = RequiredPermission<OrganizationStatement, R>

export const ac = createAccessControl(statement)

export const ownerRole = ac.newRole({
  ...ownerAc.statements,
  ...organizationGrants.owner,
})

export const adminRole = ac.newRole({
  ...adminAc.statements,
  ...organizationGrants.admin,
})

export const memberRole = ac.newRole({
  ...memberAc.statements,
  ...organizationGrants.member,
})

export const organizationRoles = {
  owner: ownerRole,
  admin: adminRole,
  member: memberRole,
} as const

const ownerRoleName = "owner" as const satisfies keyof typeof organizationRoles

export function authorizeStaticOrganizationRole<R extends OrganizationResource>(
  roleName: string,
  resource: R,
  action: OrganizationAction<R>
): boolean {
  const role =
    organizationRoles[roleName.trim() as keyof typeof organizationRoles]
  return role?.authorize({ [resource]: [action] }).success ?? false
}

export function checkOrganizationPermission<R extends OrganizationResource>(
  organizationRole: string | null | undefined,
  resource: R,
  action: OrganizationAction<R>
): boolean {
  if (!organizationRole) return false

  return organizationRole
    .split(",")
    .some((roleName) =>
      authorizeStaticOrganizationRole(roleName, resource, action)
    )
}

export function parseOrganizationRoles(role: string | null | undefined) {
  return (role ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
}

export function formatOrganizationRoleLabel(role: string) {
  return parseOrganizationRoles(role)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(", ")
}

export function getStaticOrganizationRoleNames(): (keyof typeof organizationRoles)[] {
  return Object.keys(organizationRoles) as (keyof typeof organizationRoles)[]
}

export function canAssignOrganizationRole(
  assignerRole: string | null | undefined,
  targetRole: string
) {
  if (targetRole === ownerRoleName) {
    return parseOrganizationRoles(assignerRole).includes(ownerRoleName)
  }

  return true
}
