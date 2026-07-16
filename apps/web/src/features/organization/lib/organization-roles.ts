import {
  ASSIGNABLE_ORG_ROLES,
  STATIC_ORG_ROLES,
  isPermissionResource,
  isStaticOrgRole,
  rolePermissionCatalog,
  type PermissionResource,
  type RolePermissionCatalog,
} from "@workspace/auth/access"

/** Re-exports — single source lives in `@workspace/auth/access`. */
export {
  ASSIGNABLE_ORG_ROLES,
  STATIC_ORG_ROLES,
  isPermissionResource,
  isStaticOrgRole,
  rolePermissionCatalog as ROLE_PERMISSION_CATALOG,
}
export type { PermissionResource, RolePermissionCatalog as PermissionCatalog }

export function formatRoleLabel(role: string) {
  if (!role) return "—"
  return role
    .split(/[,\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(", ")
}
