import { hasPermission } from "../../permissions/has-permission.js"
import type { Permission } from "../../permissions/types.js"

export function useCan(permission: Permission, role: string | null | undefined): boolean {
  if (!role) return false
  return hasPermission(role, permission)
}
