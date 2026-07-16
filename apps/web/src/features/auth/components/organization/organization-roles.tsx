"use client"

import { authClient } from "@workspace/auth/client"
import { useQueryClient } from "@tanstack/react-query"
import { useState, type ComponentProps } from "react"
import { toast } from "sonner"

import { RoleFormDialog } from "@/features/organization/components/role-form-dialog"
import { useOrganizationRolePermissions } from "@/features/organization/hooks/use-organization-role-permissions"
import {
  organizationRolesKey,
  useOrganizationRoles,
  type OrganizationRole,
} from "@/features/organization/hooks/use-organization-roles"
import { cn } from "@workspace/ui-shadcn/lib/utils"
import { BuiltInRolesSection } from "@/features/auth/components/organization/built-in-roles-section"
import { CustomRolesSection } from "@/features/auth/components/organization/custom-roles-section"
import { DeleteOrganizationRoleDialog } from "@/features/auth/components/organization/delete-organization-role-dialog"

export type OrganizationRolesProps = {
  className?: string
}

/**
 * Organization roles: built-in reference list + custom role CRUD.
 */
export function OrganizationRoles({
  className,
  ...props
}: OrganizationRolesProps & ComponentProps<"div">) {
  const queryClient = useQueryClient()
  const { data: organization, isPending: orgPending } =
    authClient.useActiveOrganization()
  const permissions = useOrganizationRolePermissions(organization?.id)
  const rolesQuery = useOrganizationRoles(
    permissions.canListRoles ? organization?.id : null
  )

  const [roleFormOpen, setRoleFormOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<OrganizationRole | null>(null)
  const [roleToDelete, setRoleToDelete] = useState<OrganizationRole | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const customRoles = rolesQuery.data ?? []
  const isPending = orgPending || permissions.isPending || rolesQuery.isPending

  async function refreshRoles() {
    if (!organization?.id) return
    await queryClient.invalidateQueries({
      queryKey: organizationRolesKey(organization.id),
    })
  }

  async function handleDelete() {
    if (!roleToDelete) return
    setIsDeleting(true)
    const result = await authClient.organization.deleteRole({
      roleId: roleToDelete.id,
    })
    setIsDeleting(false)
    if (result.error) {
      toast.error(result.error.message ?? "Could not delete role")
      return
    }
    toast.success(`Deleted role ${roleToDelete.role}`)
    setRoleToDelete(null)
    await refreshRoles()
  }

  function openCreate() {
    setEditingRole(null)
    setRoleFormOpen(true)
  }

  if (!permissions.canListRoles && !permissions.isPending) {
    return null
  }

  return (
    <div
      className={cn("flex w-full flex-col gap-4 md:gap-6", className)}
      {...props}
    >
      <BuiltInRolesSection />
      <CustomRolesSection
        canCreateRoles={permissions.canCreateRoles}
        canDeleteRoles={permissions.canDeleteRoles}
        canUpdateRoles={permissions.canUpdateRoles}
        customRoles={customRoles}
        isPending={isPending}
        onCreate={openCreate}
        onDelete={setRoleToDelete}
        onEdit={(role) => {
          setEditingRole(role)
          setRoleFormOpen(true)
        }}
      />

      <RoleFormDialog
        open={roleFormOpen}
        editingRole={editingRole}
        onOpenChange={setRoleFormOpen}
        onSaved={() => {
          void refreshRoles()
        }}
      />

      <DeleteOrganizationRoleDialog
        isDeleting={isDeleting}
        role={roleToDelete}
        onConfirm={() => {
          void handleDelete()
        }}
        onOpenChange={(open) => {
          if (!open) setRoleToDelete(null)
        }}
      />
    </div>
  )
}
