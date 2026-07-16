import { useQueries } from "@tanstack/react-query"
import { authClient } from "@workspace/auth/client"

const CHECKS = [
  { key: "settingsUpdate", permissions: { settings: ["update"] } },
  { key: "memberUpdate", permissions: { member: ["update"] } },
  { key: "memberDelete", permissions: { member: ["delete"] } },
  { key: "invitationCreate", permissions: { invitation: ["create"] } },
  { key: "invitationCancel", permissions: { invitation: ["cancel"] } },
  { key: "acCreate", permissions: { ac: ["create"] } },
  { key: "acUpdate", permissions: { ac: ["update"] } },
  { key: "acDelete", permissions: { ac: ["delete"] } },
  { key: "acRead", permissions: { ac: ["read"] } },
] as const

async function checkPermission(
  permissions: Readonly<Record<string, readonly string[]>>
) {
  const result = await authClient.organization.hasPermission({
    permissions: Object.fromEntries(
      Object.entries(permissions).map(([resource, actions]) => [
        resource,
        [...actions],
      ])
    ),
  })
  if (result.error) return false
  return Boolean(result.data?.success)
}

function flagAt(
  results: readonly { readonly data?: boolean }[],
  index: number
) {
  return results[index]?.data === true
}

export function useWorkspacePermissions(
  organizationId: string | null | undefined
) {
  const enabled = Boolean(organizationId)
  const results = useQueries({
    queries: CHECKS.map((check) => ({
      queryKey: ["workspace", "permission", organizationId, check.key] as const,
      enabled,
      staleTime: 30_000,
      queryFn: () => checkPermission(check.permissions),
    })),
  })

  return {
    canUpdateSettings: flagAt(results, 0),
    canAssignRoles: flagAt(results, 1),
    canRemoveMembers: flagAt(results, 2),
    canInvite: flagAt(results, 3),
    canCancelInvites: flagAt(results, 4),
    canCreateRoles: flagAt(results, 5),
    canUpdateRoles: flagAt(results, 6),
    canDeleteRoles: flagAt(results, 7),
    canListRoles: flagAt(results, 8),
    isPending: enabled && results.some((result) => result.isPending),
  }
}
