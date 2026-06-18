export const defaultStatements = {
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "impersonate-admins",
    "delete",
    "set-password",
    "get",
    "update",
  ] as const,
  session: ["list", "revoke", "delete"] as const,
}

export const statement = {
  ...defaultStatements,
  user: [...defaultStatements.user, "read"] as const,
  profile: ["read", "update"] as const,
  subscription: ["read", "update", "cancel"] as const,
  analytics: ["read"] as const,
  settings: ["read", "update"] as const,
}

export type PermissionStatement = typeof statement

export const rolePermissions = {
  admin: {
    user: [...defaultStatements.user, "read"] as const,
    session: [...defaultStatements.session] as const,
    profile: ["read", "update"] as const,
    subscription: ["read", "update", "cancel"] as const,
    analytics: ["read"] as const,
    settings: ["read", "update"] as const,
  },
  user: {
    profile: ["read", "update"] as const,
    subscription: ["read"] as const,
    settings: ["read", "update"] as const,
  },
}

export const roleHierarchy = {
  admin: ["user"] as const,
  user: [] as const,
}

export function getPermissions(
  role: string
): Record<string, readonly string[]> | undefined {
  switch (role) {
    case "admin":
      return rolePermissions.admin
    case "user":
      return rolePermissions.user
    default:
      return undefined
  }
}

export function getHierarchy(role: string): readonly string[] | undefined {
  switch (role) {
    case "admin":
      return roleHierarchy.admin
    case "user":
      return roleHierarchy.user
    default:
      return undefined
  }
}
