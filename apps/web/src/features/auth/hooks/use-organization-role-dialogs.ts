import type { OrganizationPermissionMap } from "@workspace/auth/permissions/organization"
import {
  useCreateOrganizationRole,
  useDeleteOrganizationRole,
  useUpdateOrganizationRole,
} from "@workspace/auth/react"
import type { OrganizationRole } from "@workspace/auth/types/organization"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"
import {
  createOrganizationRoleSchema,
  editOrganizationRoleSchema,
  type CreateOrganizationRoleInput,
  type EditOrganizationRoleInput,
} from "@workspace/auth/forms"

const emptyPermissions: OrganizationPermissionMap = {}

export function useOrganizationRoleDialogs() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<OrganizationRole | null>(
    null
  )

  const createForm = useForm<CreateOrganizationRoleInput>({
    resolver: zodResolver(createOrganizationRoleSchema),
    defaultValues: { role: "", permission: emptyPermissions },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const editForm = useForm<EditOrganizationRoleInput>({
    resolver: zodResolver(editOrganizationRoleSchema),
    defaultValues: { permission: emptyPermissions },
  })

  const { mutateAsync: createRole, isPending: isCreating } =
    useCreateOrganizationRole()
  const { mutateAsync: updateRole, isPending: isUpdating } =
    useUpdateOrganizationRole()
  const { mutateAsync: deleteRole, isPending: isDeleting } =
    useDeleteOrganizationRole()

  function resetCreateForm() {
    createForm.reset({ role: "", permission: emptyPermissions })
  }

  function openCreateDialog() {
    resetCreateForm()
    setCreateOpen(true)
  }

  function handleCreateOpenChange(open: boolean) {
    if (!open) resetCreateForm()
    setCreateOpen(open)
  }

  function openEditDialog(role: OrganizationRole) {
    setSelectedRole(role)
    editForm.reset({ permission: role.permission ?? emptyPermissions })
    setEditOpen(true)
  }

  function handleEditOpenChange(open: boolean) {
    if (!open) {
      setSelectedRole(null)
      editForm.reset({ permission: emptyPermissions })
    }
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

  const handleCreateSubmit = createForm.handleSubmit((values) => {
    void toastManager
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
  })

  const handleEditSubmit = editForm.handleSubmit((values) => {
    if (!selectedRole) return

    void toastManager
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
  })

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
        control: createForm.control,
        isPending: isCreating,
        onSubmit: handleCreateSubmit,
      },
      editDialog: {
        open: editOpen,
        onOpenChange: handleEditOpenChange,
        role: selectedRole,
        control: editForm.control,
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
