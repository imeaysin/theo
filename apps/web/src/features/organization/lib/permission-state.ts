import type { PermissionResource } from "@/features/organization/lib/organization-roles"
import { isPermissionResource } from "@/features/organization/lib/organization-roles"

export type PermissionState = Partial<Record<PermissionResource, Set<string>>>

export function emptyPermissionState(): PermissionState {
  return {}
}

export function permissionStateFromRole(permission: Record<string, string[]>) {
  const next = emptyPermissionState()
  for (const [resource, actions] of Object.entries(permission)) {
    if (!isPermissionResource(resource)) continue
    next[resource] = new Set(actions)
  }
  return next
}

export function toPermissionPayload(
  state: PermissionState
): Record<string, string[]> {
  const permission: Record<string, string[]> = {}
  for (const [resource, actions] of Object.entries(state)) {
    if (!isPermissionResource(resource) || !actions || actions.size === 0) {
      continue
    }
    permission[resource] = [...actions]
  }
  return permission
}

export function countSelectedPermissions(state: PermissionState) {
  return Object.values(state).reduce(
    (total, actions) => total + (actions?.size ?? 0),
    0
  )
}
