import { authClient } from "../lib/auth-client"
import type { OrganizationRoleName } from "../config/organization-plugin"
import { roles as staticOrganizationRoles } from "../permissions/organization"

export {
  ac as organizationAc,
  roles as staticOrganizationRoles,
  statement as organizationStatement,
} from "../permissions/organization"

export type { OrganizationRoleName } from "../config/organization-plugin"

export const organizationPermissions = {
  deleteOrganization: { organization: ["delete"] },
  updateOrganization: { organization: ["update"] },
  updateMember: { member: ["update"] },
  removeMember: { member: ["delete"] },
  inviteMember: { invitation: ["create"] },
  cancelInvitation: { invitation: ["cancel"] },
} as const satisfies Record<string, Record<string, string[]>>

export type OrganizationPermissionKey = keyof typeof organizationPermissions

export function getStaticOrganizationRoleNames(): OrganizationRoleName[] {
  return Object.keys(staticOrganizationRoles) as OrganizationRoleName[]
}

export function formatOrganizationRoleLabel(role: string) {
  return role
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(", ")
}

export function parseOrganizationRoles(role: string | null | undefined) {
  return (role ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
}

export function checkOrganizationRolePermission(
  role: string,
  permissions: Record<string, string[]>
) {
  const primaryRole = role.split(",")[0]?.trim()
  if (!primaryRole) return false

  return authClient.organization.checkRolePermission({
    role: primaryRole as OrganizationRoleName,
    permissions,
  })
}

export function canAssignOrganizationRole(
  assignerRole: string | null | undefined,
  targetRole: string
) {
  const assignerRoles = parseOrganizationRoles(assignerRole)
  if (targetRole === "owner") {
    return assignerRoles.includes("owner")
  }

  return assignerRoles.some((role) =>
    checkOrganizationRolePermission(role, organizationPermissions.updateMember)
  )
}
