import { authClient } from "@workspace/auth/client"
import { toast } from "sonner"
import type { OrganizationRole } from "@/features/organization/hooks/use-organization-roles"

type SaveRoleInput = {
  readonly editingRole: OrganizationRole | null
  readonly roleName: string
  readonly permission: Record<string, string[]>
}

export async function saveOrganizationRole(input: SaveRoleInput) {
  if (input.editingRole) {
    const result = await authClient.organization.updateRole({
      roleId: input.editingRole.id,
      data: {
        permission: input.permission,
        roleName: input.roleName,
      },
    })
    if (result.error) {
      toast.error(result.error.message ?? "Could not update role")
      return false
    }
    toast.success("Role updated")
    return true
  }

  const result = await authClient.organization.createRole({
    role: input.roleName,
    permission: input.permission,
  })
  if (result.error) {
    toast.error(result.error.message ?? "Could not create role")
    return false
  }
  toast.success("Role created")
  return true
}
