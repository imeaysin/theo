import { hasPermission } from "../../permissions/has-permission"
import type { Permission } from "../../permissions/types"

export function useCan(permission: Permission, role: string | null | undefined): boolean {
  if (!role) return false
  return hasPermission(role, permission)
}
