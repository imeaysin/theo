import { Dialog, DialogContent } from "@workspace/ui-shadcn/components/dialog"
import { RoleFormBody } from "@/features/organization/components/role-form-body"
import type { OrganizationRole } from "@/features/organization/hooks/use-organization-roles"

type RoleFormDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly editingRole: OrganizationRole | null
  readonly onSaved: () => void
}

export function RoleFormDialog({
  open,
  onOpenChange,
  editingRole,
  onSaved,
}: RoleFormDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="flex max-h-[min(90dvh,40rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        {open ? (
          <RoleFormBody
            key={editingRole?.id ?? "new-role"}
            editingRole={editingRole}
            onOpenChange={onOpenChange}
            onSaved={onSaved}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
