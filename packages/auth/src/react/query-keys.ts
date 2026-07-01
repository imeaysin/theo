import type { OrganizationPermissionMap } from "../permissions/organization"

export const authQueryKeys = {
  all: ["auth"] as const,
  session: () => [...authQueryKeys.all, "session"] as const,
  user: () => [...authQueryKeys.all, "user"] as const,
  accounts: () => [...authQueryKeys.all, "accounts"] as const,
  accountInfo: (accountId?: string) =>
    [...authQueryKeys.all, "account-info", accountId] as const,
  sessions: () => [...authQueryKeys.all, "sessions"] as const,
  deviceSessions: () => [...authQueryKeys.all, "device-sessions"] as const,
  passkeys: () => [...authQueryKeys.all, "passkeys"] as const,
  apiKeys: () => [...authQueryKeys.all, "api-keys"] as const,
  organizations: () => [...authQueryKeys.all, "organizations"] as const,
  activeOrganization: (slug?: string) =>
    [...authQueryKeys.all, "active-organization", slug] as const,
  fullOrganization: (organizationId?: string) =>
    [...authQueryKeys.all, "full-organization", organizationId] as const,
  organizationMembers: (organizationId?: string) =>
    [...authQueryKeys.all, "organization-members", organizationId] as const,
  organizationInvitations: (organizationId?: string) =>
    [...authQueryKeys.all, "organization-invitations", organizationId] as const,
  organizationRoles: (organizationId?: string) =>
    [...authQueryKeys.all, "organization-roles", organizationId] as const,
  activeMember: (organizationId?: string) =>
    [...authQueryKeys.all, "active-member", organizationId] as const,
  userInvitations: () => [...authQueryKeys.all, "user-invitations"] as const,
  organizationPermission: (
    organizationId: string,
    permission: OrganizationPermissionMap
  ) =>
    [
      ...authQueryKeys.all,
      "organization-permission",
      organizationId,
      permission,
    ] as const,
  usernameAvailable: (username: string) =>
    [...authQueryKeys.all, "username-available", username] as const,
} as const
