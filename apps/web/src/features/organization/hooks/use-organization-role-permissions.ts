import { useOrgPermissionFlags } from "@/hooks/use-org-permission"

const ROLE_PERMISSION_CHECKS = [
  { key: "acCreate", permissions: { ac: ["create"] } },
  { key: "acUpdate", permissions: { ac: ["update"] } },
  { key: "acDelete", permissions: { ac: ["delete"] } },
  { key: "acRead", permissions: { ac: ["read"] } },
] as const

export function useOrganizationRolePermissions(
  organizationId: string | null | undefined
) {
  const { flags, isPending } = useOrgPermissionFlags(
    ROLE_PERMISSION_CHECKS,
    organizationId
  )

  return {
    canCreateRoles: flags.acCreate === true,
    canUpdateRoles: flags.acUpdate === true,
    canDeleteRoles: flags.acDelete === true,
    canListRoles: flags.acRead === true,
    isPending,
  }
}
