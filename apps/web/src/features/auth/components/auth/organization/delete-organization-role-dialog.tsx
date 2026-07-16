import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import type { OrganizationRole } from "@/features/organization/hooks/use-organization-roles"
import { formatRoleLabel } from "@/features/organization/lib/organization-roles"

type DeleteOrganizationRoleDialogProps = {
  readonly isDeleting: boolean
  readonly role: OrganizationRole | null
  readonly onConfirm: () => void
  readonly onOpenChange: (open: boolean) => void
}

export function DeleteOrganizationRoleDialog({
  isDeleting,
  role,
  onConfirm,
  onOpenChange,
}: DeleteOrganizationRoleDialogProps) {
  return (
    <AlertDialog open={role != null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete role</AlertDialogTitle>
          <AlertDialogDescription>
            Delete{" "}
            <span className="font-medium text-foreground">
              {role ? formatRoleLabel(role.role) : ""}
            </span>
            ? Members using this role must be reassigned first.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting}
            onClick={(event) => {
              event.preventDefault()
              onConfirm()
            }}
          >
            {isDeleting ? <Spinner /> : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
