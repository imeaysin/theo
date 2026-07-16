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
import type {
  WorkspaceInvitation,
  WorkspaceMember,
  WorkspaceRole,
} from "@/features/workspace/hooks/use-workspace"

export type WorkspaceConfirmAction =
  | { readonly type: "remove-member"; readonly member: WorkspaceMember }
  | { readonly type: "cancel-invite"; readonly invite: WorkspaceInvitation }
  | { readonly type: "delete-role"; readonly role: WorkspaceRole }

type WorkspaceConfirmDialogProps = {
  readonly action: WorkspaceConfirmAction | null
  readonly onOpenChange: (open: boolean) => void
  readonly onConfirm: () => void
}

function titleFor(action: WorkspaceConfirmAction) {
  if (action.type === "remove-member") return "Remove member?"
  if (action.type === "cancel-invite") return "Cancel invitation?"
  return "Delete role?"
}

function descriptionFor(action: WorkspaceConfirmAction) {
  if (action.type === "remove-member") {
    return `Remove ${action.member.user.name} from this workspace.`
  }
  if (action.type === "cancel-invite") {
    return `Cancel the pending invite to ${action.invite.email}.`
  }
  return `Delete the custom role “${action.role.role}”. Members using it must be reassigned first.`
}

export function WorkspaceConfirmDialog({
  action,
  onOpenChange,
  onConfirm,
}: WorkspaceConfirmDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={Boolean(action)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action ? titleFor(action) : "Confirm"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {action ? descriptionFor(action) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant="destructive">
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
