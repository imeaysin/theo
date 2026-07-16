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
import type { OrgRole } from "@/features/organization/hooks/use-org-roles"
import { formatRoleLabel } from "@/features/organization/lib/org-roles"

type DeleteOrgRoleDialogProps = {
  readonly isDeleting: boolean
  readonly role: OrgRole | null
  readonly onConfirm: () => void
  readonly onOpenChange: (open: boolean) => void
}

export function DeleteOrgRoleDialog({
  isDeleting,
  role,
  onConfirm,
  onOpenChange,
}: DeleteOrgRoleDialogProps) {
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
