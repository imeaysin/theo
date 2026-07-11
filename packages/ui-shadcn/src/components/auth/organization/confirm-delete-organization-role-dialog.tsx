"use client"

import { formatOrganizationRoleLabel } from "@workspace/auth/permissions/organization"
import type { OrganizationRole } from "@workspace/auth/types/organization"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui-shadcn/components/alert-dialog"

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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete role?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{roleLabel}</span>{" "}
            will be permanently deleted. Reassign members on this role before
            deleting.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault()
              onSubmit()
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete role"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
