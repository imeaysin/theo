import type { OrganizationPermissionMap } from "@workspace/auth/permissions/organization"
import {
  useCreateOrganizationRole,
  useDeleteOrganizationRole,
  useUpdateOrganizationRole,
} from "@workspace/auth/react"
import type { OrganizationRole } from "@workspace/auth/types/organization"
import { useState } from "react"
import { toastManager } from "@workspace/ui-shadcn/components/toast"

export function useOrganizationRoleDialogs() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<OrganizationRole | null>(
    null
  )

  const { mutateAsync: createRole, isPending: isCreating } =
    useCreateOrganizationRole()
  const { mutateAsync: updateRole, isPending: isUpdating } =
    useUpdateOrganizationRole()
  const { mutateAsync: deleteRole, isPending: isDeleting } =
    useDeleteOrganizationRole()

  function openCreateDialog() {
    setCreateOpen(true)
  }

  function handleCreateOpenChange(open: boolean) {
    setCreateOpen(open)
  }

  function openEditDialog(role: OrganizationRole) {
    setSelectedRole(role)
    setEditOpen(true)
  }

  function handleEditOpenChange(open: boolean) {
    if (!open) setSelectedRole(null)
    setEditOpen(open)
  }

  function openDeleteDialog(role: OrganizationRole) {
    setSelectedRole(role)
    setDeleteOpen(true)
  }

  function handleDeleteOpenChange(open: boolean) {
    if (!open) setSelectedRole(null)
    setDeleteOpen(open)
  }

  async function handleCreateSubmit(values: {
    role: string
    permission: OrganizationPermissionMap
  }) {
    await toastManager
      .promise(
        createRole({
          role: values.role.trim().toLowerCase(),
          permission: values.permission,
        }),
        {
          error: {
            description: "Please try again.",
            title: "Could not create role",
            type: "error",
          },
          loading: {
            title: "Creating role…",
            description: "The role is being created.",
            type: "loading",
          },
          success: {
            title: "Role created",
            description: "The role has been created.",
            type: "success",
          },
        }
      )
      .then(() => handleCreateOpenChange(false))
      .catch(() => undefined)
  }

  async function handleEditSubmit(values: {
    permission: OrganizationPermissionMap
  }) {
    if (!selectedRole) return

    await toastManager
      .promise(
        updateRole({
          roleId: selectedRole.id,
          data: { permission: values.permission },
        }),
        {
          error: {
            description: "Please try again.",
            title: "Could not update role",
            type: "error",
          },
          loading: {
            title: "Updating role…",
            description: "The role is being updated.",
            type: "loading",
          },
          success: {
            title: "Role updated",
            description: "The role has been updated.",
            type: "success",
          },
        }
      )
      .then(() => handleEditOpenChange(false))
      .catch(() => undefined)
  }

  function handleDeleteSubmit() {
    if (!selectedRole) return

    void toastManager
      .promise(deleteRole({ roleId: selectedRole.id }), {
        error: {
          description: "Please try again.",
          title: "Could not delete role",
          type: "error",
        },
        loading: {
          title: "Deleting role…",
          description: "The role is being deleted.",
          type: "loading",
        },
        success: {
          title: "Role deleted",
          description: "The role has been deleted.",
          type: "success",
        },
      })
      .then(() => handleDeleteOpenChange(false))
      .catch(() => undefined)
  }

  return {
    rolesProps: {
      onCreateClick: openCreateDialog,
      onEditRole: openEditDialog,
      onDeleteRole: openDeleteDialog,
      createDialog: {
        open: createOpen,
        onOpenChange: handleCreateOpenChange,
        defaultPermissions: {},
        isPending: isCreating,
        onSubmit: handleCreateSubmit,
      },
      editDialog: {
        open: editOpen,
        onOpenChange: handleEditOpenChange,
        role: selectedRole,
        isPending: isUpdating,
        onSubmit: handleEditSubmit,
      },
      deleteDialog: {
        open: deleteOpen,
        onOpenChange: handleDeleteOpenChange,
        role: selectedRole,
        isPending: isDeleting,
        onSubmit: handleDeleteSubmit,
      },
    },
  }
}
