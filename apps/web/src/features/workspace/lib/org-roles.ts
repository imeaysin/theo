import { Roles } from "@workspace/auth/access"

/** Static org roles shipped in code (not stored as dynamic organizationRole rows). */
export const STATIC_ORG_ROLES = [
  Roles.owner,
  Roles.admin,
  Roles.member,
  Roles.viewer,
] as const

/** Roles that can be invited / assigned from the UI (owner is transfer-only). */
export const ASSIGNABLE_ORG_ROLES = [
  Roles.admin,
  Roles.member,
  Roles.viewer,
] as const

/** Resources & actions available when creating custom roles. */
export const ROLE_PERMISSION_CATALOG = {
  project: ["create", "read", "update", "delete", "publish", "archive"],
  report: ["create", "read", "update", "delete", "export"],
  invoice: ["create", "read", "update", "delete", "approve"],
  member: ["create", "read", "update", "delete"],
  invitation: ["create", "cancel"],
  settings: ["read", "update"],
} as const

export type PermissionCatalog = typeof ROLE_PERMISSION_CATALOG
export type PermissionResource = keyof PermissionCatalog
export type RolePermissionMap = Readonly<
  Partial<Record<PermissionResource, readonly string[]>>
>

export function isStaticOrgRole(role: string) {
  return (STATIC_ORG_ROLES as readonly string[]).includes(role)
}

export function formatRoleLabel(role: string) {
  if (!role) return "—"
  return role
    .split(/[,\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(", ")
}

export function isPermissionResource(
  value: string
): value is PermissionResource {
  return Object.hasOwn(ROLE_PERMISSION_CATALOG, value)
}
