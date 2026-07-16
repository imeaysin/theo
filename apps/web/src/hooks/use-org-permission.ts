import { useQueries, useQuery } from "@tanstack/react-query"
import { authClient } from "@workspace/auth/client"

export type OrgPermissions = Readonly<Record<string, readonly string[]>>

function toMutablePermissions(permissions: OrgPermissions) {
  return Object.fromEntries(
    Object.entries(permissions).map(([resource, actions]) => [
      resource,
      [...actions],
    ])
  )
}

/** Stable query key fragment for a permissions object. */
export function orgPermissionKey(permissions: OrgPermissions) {
  return Object.entries(permissions)
    .map(
      ([resource, actions]) => `${resource}:${[...actions].sort().join(",")}`
    )
    .sort()
    .join("|")
}

/**
 * Async org RBAC check via Better Auth.
 * Includes **custom (dynamic) roles** — never use `checkRolePermission` for that.
 */
export async function checkOrgPermission(permissions: OrgPermissions) {
  const result = await authClient.organization.hasPermission({
    permissions: toMutablePermissions(permissions),
  })
  if (result.error) return false
  return Boolean(result.data?.success)
}

/**
 * Gate module UI by permission (works for static + custom roles).
 *
 * @example
 * const canCreate = useHasOrgPermission({ project: ["create"] }, orgId)
 * {canCreate.data ? <Button>New</Button> : null}
 */
export function useHasOrgPermission(
  permissions: OrgPermissions,
  organizationId: string | null | undefined
) {
  const key = orgPermissionKey(permissions)
  return useQuery({
    queryKey: ["org", "permission", organizationId, key] as const,
    enabled: Boolean(organizationId),
    staleTime: 30_000,
    queryFn: () => checkOrgPermission(permissions),
  })
}

type NamedPermissionCheck = {
  readonly key: string
  readonly permissions: OrgPermissions
}

/** Batch several permission checks (e.g. workspace settings page). */
export function useOrgPermissionFlags(
  checks: readonly NamedPermissionCheck[],
  organizationId: string | null | undefined
) {
  const enabled = Boolean(organizationId)
  const results = useQueries({
    queries: checks.map((check) => ({
      queryKey: [
        "org",
        "permission",
        organizationId,
        check.key,
        orgPermissionKey(check.permissions),
      ] as const,
      enabled,
      staleTime: 30_000,
      queryFn: () => checkOrgPermission(check.permissions),
    })),
  })

  const flags: Record<string, boolean> = {}
  for (let index = 0; index < checks.length; index++) {
    const check = checks[index]
    if (!check) continue
    flags[check.key] = results[index]?.data === true
  }

  return {
    flags,
    isPending: enabled && results.some((result) => result.isPending),
  }
}
