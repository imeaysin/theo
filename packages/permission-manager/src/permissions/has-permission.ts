import { getPermissions, getHierarchy } from "./config"
import type { Permission } from "./types"

type ResourceMap = Record<string, Set<string>>

function resolvePermissions(role: string): ResourceMap {
  const resolved: ResourceMap = {}
  const visited = new Set<string>()

  function walk(currentRole: string): void {
    if (visited.has(currentRole)) return
    visited.add(currentRole)

    const perms = getPermissions(currentRole)
    if (perms) {
      for (const resource of Object.keys(perms)) {
        const actions = perms[resource as keyof typeof perms]
        if (!actions) continue
        if (!resolved[resource]) resolved[resource] = new Set()
        for (const action of actions) {
          resolved[resource].add(action)
        }
      }
    }

    const parents = getHierarchy(currentRole)
    if (parents) {
      for (const parent of parents) walk(parent)
    }
  }

  walk(role)
  return resolved
}

const cache = new Map<string, ResourceMap>()

export function hasPermission(role: string, permission: Permission): boolean {
  if (!cache.has(role)) cache.set(role, resolvePermissions(role))
  const resolved = cache.get(role)!

  for (const resource of Object.keys(permission)) {
    const actions = permission[resource as keyof typeof permission]
    if (!actions || actions.length === 0) continue
    const allowed = resolved[resource]
    if (!allowed) return false
    for (const action of actions) {
      if (!allowed.has(action)) return false
    }
  }

  return true
}
