import { authClient } from "@workspace/auth/client"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui-shadcn/components/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui-shadcn/components/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui-shadcn/components/select"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import {
  ASSIGNABLE_ORG_ROLES,
  formatRoleLabel,
} from "@/features/workspace/lib/org-roles"
import type { WorkspaceMember } from "@/features/workspace/hooks/use-workspace"

type AssignRoleDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly member: WorkspaceMember | null
  readonly roleOptions: readonly string[]
  readonly onAssigned: () => void
}

function initialRoleFor(member: WorkspaceMember, options: readonly string[]) {
  const primary = member.role.split(",")[0]?.trim()
  if (primary && options.includes(primary)) return primary
  return options[0] ?? "member"
}

export function AssignRoleDialog({
  open,
  onOpenChange,
  member,
  roleOptions,
  onAssigned,
}: AssignRoleDialogProps) {
  const options = useMemo(
    () => (roleOptions.length > 0 ? roleOptions : ASSIGNABLE_ORG_ROLES),
    [roleOptions]
  )

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        {member ? (
          <AssignRoleForm
            key={member.id}
            member={member}
            onAssigned={onAssigned}
            onOpenChange={onOpenChange}
            options={options}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

type AssignRoleFormProps = {
  readonly member: WorkspaceMember
  readonly options: readonly string[]
  readonly onAssigned: () => void
  readonly onOpenChange: (open: boolean) => void
}

function AssignRoleForm({
  member,
  options,
  onAssigned,
  onOpenChange,
}: AssignRoleFormProps) {
  const [role, setRole] = useState(() => initialRoleFor(member, options))
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit() {
    setIsPending(true)
    const result = await authClient.organization.updateMemberRole({
      memberId: member.id,
      role,
    })
    setIsPending(false)
    if (result.error) {
      toast.error(result.error.message ?? "Could not update role")
      return
    }
    toast.success(`Updated role for ${member.user.name}`)
    onAssigned()
    onOpenChange(false)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Assign role</DialogTitle>
        <DialogDescription>
          Change the workspace role for {member.user.name} ({member.user.email}
          ).
        </DialogDescription>
      </DialogHeader>
      <FieldGroup className="py-4">
        <Field>
          <FieldLabel htmlFor="assign-role">Role</FieldLabel>
          <Select
            disabled={isPending}
            onValueChange={(value) => {
              if (value) setRole(value)
            }}
            value={role}
          >
            <SelectTrigger id="assign-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {formatRoleLabel(option)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
      <DialogFooter>
        <DialogClose
          disabled={isPending}
          render={<Button type="button" variant="outline" />}
        >
          Cancel
        </DialogClose>
        <Button
          disabled={isPending}
          onClick={() => void handleSubmit()}
          type="button"
        >
          {isPending ? <Spinner data-icon="inline-start" /> : null}
          Save role
        </Button>
      </DialogFooter>
    </>
  )
}
