"use client"

import { formatOrganizationRoleLabel } from "@workspace/auth/permissions/organization"
import type { OrganizationRole } from "@workspace/auth/types/organization"
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog"

export type ConfirmDeleteOrganizationRoleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: OrganizationRole | null
  onSubmit: () => void
  isPending?: boolean
}

export function ConfirmDeleteOrganizationRoleDialog({
  open,
  onOpenChange,
  role,
  onSubmit,
  isPending = false,
}: ConfirmDeleteOrganizationRoleDialogProps) {
  if (!role) return null

  const roleLabel = formatOrganizationRoleLabel(role.role)

  return (
    <ConfirmDialog
      confirmLabel="Delete role"
      description={
        <>
          <span className="font-medium text-foreground">{roleLabel}</span> will
          be permanently deleted. Reassign members on this role before deleting.
        </>
      }
      onConfirm={onSubmit}
      onOpenChange={onOpenChange}
      open={open}
      pending={isPending}
      title="Delete role?"
      variant="destructive"
    />
  )
}
