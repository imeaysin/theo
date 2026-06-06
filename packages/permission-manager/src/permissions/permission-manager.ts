import { getPermissions, getHierarchy } from "./config.js"
import type { Permission } from "./types.js"

type ResourceMap = Record<string, string[]>

export class PermissionManager {
  private readonly resolved: ResourceMap

  constructor(private readonly ctx: { role: string }) {
    this.resolved = PermissionManager.#resolve(ctx.role)
  }

  can(permission: Permission): boolean {
    for (const resource of Object.keys(permission)) {
      const actions = permission[resource as keyof typeof permission]
      if (!actions || actions.length === 0) continue
      const allowed = this.resolved[resource]
      if (!allowed) return false
      for (const action of actions) {
        if (!allowed.includes(action)) return false
      }
    }

    return true
  }

  canAll(permissions: Permission[]): boolean {
    return permissions.every((p) => this.can(p))
  }

  canAny(permissions: Permission[]): boolean {
    return permissions.some((p) => this.can(p))
  }

  hasRole(target: string): boolean {
    return this.ctx.role === target || this.#inherits(this.ctx.role, target)
  }

  #inherits(role: string, target: string): boolean {
    const parents = getHierarchy(role)
    if (!parents) return false
    if (parents.includes(target)) return true
    return parents.some((parent) => this.#inherits(parent, target))
  }

  static #resolve(role: string): ResourceMap {
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
          if (!resolved[resource]) resolved[resource] = []
          for (const action of actions) {
            if (!resolved[resource].includes(action)) {
              resolved[resource].push(action)
            }
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
}
