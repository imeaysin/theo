export {
  statement,
  rolePermissions,
  roleHierarchy,
} from "./permissions/config.js"
export type { PermissionStatement } from "./permissions/config.js"
export type { Permission } from "./permissions/types.js"
export { hasPermission } from "./permissions/has-permission.js"
export { PermissionManager } from "./permissions/permission-manager.js"

export { Policy } from "./policy/policy.js"
export type { PolicyContext, PolicyResult } from "./policy/policy.js"
export { PolicyGroup } from "./policy/policy-group.js"
export { PolicyBuilder } from "./policy/policy-builder.js"
