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

export const billingRole = ac.newRole(organizationGrants.billing)

export const organizationRoles = {
  owner: ownerRole,
  admin: adminRole,
  member: memberRole,
  billing: billingRole,
} as const

const ownerRoleName = "owner" satisfies keyof typeof organizationRoles

function isStaticOrganizationRoleName(
  roleName: string
): roleName is keyof typeof organizationRoles {
  return roleName in organizationRoles
}

export function authorizeStaticOrganizationRole<R extends OrganizationResource>(
  roleName: string,
  resource: R,
  action: OrganizationAction<R>
): boolean {
  const trimmed = roleName.trim()
  if (!isStaticOrganizationRoleName(trimmed)) return false

  const role = organizationRoles[trimmed]
  return role.authorize({ [resource]: [action] }).success
}

export function checkOrganizationPermission<
  R extends OrganizationResource,
>(params: {
  role: string | null | undefined
  resource: R
  action: OrganizationAction<R>
}): boolean {
  if (!params.role) return false

  const roles = params.role.split(",").map((r) => r.trim())
  for (const role of roles) {
    if (!isStaticOrganizationRoleName(role)) continue

    if (
      organizationRoles[role].authorize({ [params.resource]: [params.action] })
        .success
    ) {
      return true
    }
  }

  return false
}

function isOrganizationResource(
  resource: string
): resource is OrganizationResource {
  return resource in statement
}

export function checkOrganizationPermissionMap(
  organizationRole: string | null | undefined,
  permissions: OrganizationPermissionMap
): boolean {
  for (const resource of Object.keys(permissions)) {
    if (!isOrganizationResource(resource)) continue

    const actions = permissions[resource]
    if (!actions) continue

    for (const action of actions) {
      if (
        !checkOrganizationPermission({
          role: organizationRole,
          resource: resource,
          action: action,
        })
      ) {
        return false
      }
    }
  }

  return true
}

export function createOrganizationPermissionResult(success: boolean) {
  return { error: null, success }
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
  return ["owner", "admin", "member", "billing"]
}

/** Static built-in roles plus any dynamic roles from list-roles. */
export function getOrganizationRoleNames(
  dynamicRoles?: { role: string }[] | null
): string[] {
  const staticNames = getStaticOrganizationRoleNames()
  const dynamicNames =
    dynamicRoles?.map((record) => record.role).filter(Boolean) ?? []

  return [...new Set([...staticNames, ...dynamicNames])]
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

/** Built-in roles plus optional dynamic roles, filtered by what the assigner may grant. */
export function resolveAssignableOrganizationRoles(input: {
  canAssignRoles: boolean
  activeMemberRole?: string | null
  dynamicRoles?: { role: string }[] | null
}): string[] {
  if (!input.canAssignRoles) return []

  const roleNames = getOrganizationRoleNames(input.dynamicRoles)

  return roleNames.filter((roleName) =>
    canAssignOrganizationRole(input.activeMemberRole, roleName)
  )
}

export {
  countOrganizationPermissions,
  formatOrganizationPermissionLabel,
  hasOrganizationPermission,
  isReservedOrganizationRoleName,
  organizationPermissionMatrix,
  reservedOrganizationRoleNames,
  toggleOrganizationPermission,
} from "./permission-matrix"
