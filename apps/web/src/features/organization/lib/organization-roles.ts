import {
  ASSIGNABLE_ORG_ROLES,
  STATIC_ORG_ROLES,
  isPermissionResource,
  isStaticOrgRole,
  rolePermissionCatalog,
  type PermissionResource,
  type RolePermissionCatalog,
  type StaticOrgRoleName,
} from "@workspace/auth/access"

export {
  ASSIGNABLE_ORG_ROLES,
  STATIC_ORG_ROLES,
  isPermissionResource,
  isStaticOrgRole,
  rolePermissionCatalog as ROLE_PERMISSION_CATALOG,
}
export type {
  PermissionResource,
  RolePermissionCatalog as PermissionCatalog,
  StaticOrgRoleName,
}

export const BUILT_IN_ROLE_DESCRIPTIONS: Record<StaticOrgRoleName, string> = {
  owner: "Full control, including ownership transfer",
  admin: "Manage people, roles, and most settings",
  member: "Create and update day-to-day work",
  viewer: "Read-only access across the organization",
}

export const PERMISSION_RESOURCE_LABELS: Record<PermissionResource, string> = {
  project: "Projects",
  report: "Reports",
  invoice: "Invoices",
  member: "Members",
  invitation: "Invitations",
  team: "Teams",
  settings: "Settings",
}

export function formatRoleLabel(role: string) {
  if (!role) return "—"
  return role
    .split(/[,\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(", ")
}

export function formatActionLabel(action: string) {
  if (!action) return "—"
  return action.charAt(0).toUpperCase() + action.slice(1)
}

export function countPermissions(permission: Record<string, string[]>) {
  return Object.values(permission).reduce(
    (total, actions) => total + actions.length,
    0
  )
}

export function isAssignableBuiltInRole(role: StaticOrgRoleName) {
  return ASSIGNABLE_ORG_ROLES.some((assignable) => assignable === role)
}
