import { roles } from "./platform"

export function checkPlatformPermission(
  platformRole: string,
  resource: string,
  action: string
): boolean {
  const roleKey = `${platformRole}Role` as keyof typeof roles
  const role = roles[roleKey]
  if (!role) return false

  return role.authorize({ [resource]: [action] }).success
}
