"use client"

import { authClient as theoAuthClient } from "@workspace/auth/client"
import { useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState, type ComponentProps } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RoleFormDialog } from "@/features/organization/components/role-form-dialog"
import { useOrgRolePermissions } from "@/features/organization/hooks/use-org-role-permissions"
import {
  orgRolesKey,
  useOrgRoles,
  type OrgRole,
} from "@/features/organization/hooks/use-org-roles"
import { cn } from "@/lib/utils"
import { BuiltInRolesSection } from "./organization-roles-built-in"
import { CustomRolesSection } from "./organization-roles-custom"
import { DeleteOrgRoleDialog } from "./organization-roles-delete-dialog"

export type OrganizationRolesProps = {
  className?: string
}

/**
 * Custom (dynamic) organization role management.
 * Better Auth UI has no role CRUD — only assign/invite with static role labels.
 */
export function OrganizationRoles({
  className,
  ...props
}: OrganizationRolesProps & ComponentProps<"div">) {
  const queryClient = useQueryClient()
  const { data: organization, isPending: orgPending } =
    theoAuthClient.useActiveOrganization()
  const permissions = useOrgRolePermissions(organization?.id)
  const rolesQuery = useOrgRoles(
    permissions.canListRoles ? organization?.id : null
  )

  const [roleFormOpen, setRoleFormOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<OrgRole | null>(null)
  const [roleToDelete, setRoleToDelete] = useState<OrgRole | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const customRoles = rolesQuery.data ?? []
  const isPending = orgPending || permissions.isPending || rolesQuery.isPending

  async function refreshRoles() {
    if (!organization?.id) return
    await queryClient.invalidateQueries({
      queryKey: orgRolesKey(organization.id),
    })
  }

  async function handleDelete() {
    if (!roleToDelete) return
    setIsDeleting(true)
    const result = await theoAuthClient.organization.deleteRole({
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

  if (!permissions.canListRoles && !permissions.isPending) {
    return null
  }

  return (
    <div className={cn("flex w-full flex-col", className)} {...props}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Roles</h2>
        {permissions.canCreateRoles ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingRole(null)
              setRoleFormOpen(true)
            }}
          >
            <Plus />
            Create role
          </Button>
        ) : null}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-6">
          <BuiltInRolesSection />
          <CustomRolesSection
            canDeleteRoles={permissions.canDeleteRoles}
            canUpdateRoles={permissions.canUpdateRoles}
            customRoles={customRoles}
            isPending={isPending}
            onDelete={setRoleToDelete}
            onEdit={(role) => {
              setEditingRole(role)
              setRoleFormOpen(true)
            }}
          />
        </CardContent>
      </Card>

      <RoleFormDialog
        open={roleFormOpen}
        editingRole={editingRole}
        onOpenChange={setRoleFormOpen}
        onSaved={() => {
          void refreshRoles()
        }}
      />

      <DeleteOrgRoleDialog
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
