import { hasPermission, type Permission } from '@workspace/auth/access-control';

export function useCan(
  permission: Permission,
  role: string | null | undefined,
): boolean {
  if (!role) return false;
  return hasPermission(role, permission);
}
