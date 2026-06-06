export {
  statement,
  rolePermissions,
  roleHierarchy,
} from "./permissions/config"
export type { PermissionStatement } from "./permissions/config"
export type { Permission } from "./permissions/types"
export { hasPermission } from "./permissions/has-permission"
export { PermissionManager } from "./permissions/permission-manager"

export { Policy } from "./policy/policy"
export type { PolicyContext, PolicyResult } from "./policy/policy"
export { PolicyGroup } from "./policy/policy-group"
export { PolicyBuilder } from "./policy/policy-builder"
