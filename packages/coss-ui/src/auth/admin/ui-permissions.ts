import type { PlatformPermissionCheck } from "@workspace/auth/permissions"

export const platformUiPermissions = {
  listUsers: { permissions: { user: ["list"] } },
  createUser: { permissions: { user: ["create"] } },
  setRole: { permissions: { user: ["set-role"] } },
  banUser: { permissions: { user: ["ban"] } },
  impersonateUser: { permissions: { user: ["impersonate"] } },
} as const satisfies Record<string, PlatformPermissionCheck>
