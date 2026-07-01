"use client"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectButton,
  SelectItem,
  SelectPopup,
  SelectValue,
} from "@workspace/ui/components/select"

export interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  onEmailChange: (value: string) => void
  emailError?: string
  role: string
  onRoleChange: (value: string) => void
  roleError?: string
  roles: string[]
  formatRoleLabel: (role: string) => string
  rolesPending?: boolean
  onSubmit: () => void
  isPending?: boolean
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  email,
  onEmailChange,
  emailError,
  role,
  onRoleChange,
  roleError,
  roles,
  formatRoleLabel,
  rolesPending = false,
  onSubmit,
  isPending = false,
}: InviteMemberDialogProps) {
  const fieldsDisabled = isPending || rolesPending

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>
            Send an invitation to join this workspace.
          </DialogDescription>
        </DialogHeader>

        <Form className="contents" onSubmit={onSubmit}>
          <DialogPanel className="flex flex-col gap-4">
            <Field data-invalid={!!emailError}>
              <FieldLabel htmlFor="invite-member-email">Email</FieldLabel>
              <Input
                aria-invalid={!!emailError}
                autoFocus
                disabled={fieldsDisabled}
                id="invite-member-email"
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder="name@example.com"
                type="email"
                value={email}
              />
              <FieldError>{emailError}</FieldError>
            </Field>

            <Field data-invalid={!!roleError}>
              <FieldLabel htmlFor="invite-member-role">Role</FieldLabel>
              <Select
                disabled={fieldsDisabled}
                onValueChange={(value) => onRoleChange(value ?? role)}
                value={role}
              >
                <SelectButton className="w-full" id="invite-member-role">
                  <SelectValue />
                </SelectButton>
                <SelectPopup>
                  {roles.map((roleName) => (
                    <SelectItem key={roleName} value={roleName}>
                      {formatRoleLabel(roleName)}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
              <FieldError>{roleError}</FieldError>
            </Field>
          </DialogPanel>

          <DialogFooter>
            <DialogClose
              render={
                <Button disabled={isPending} type="button" variant="outline" />
              }
            >
              Cancel
            </DialogClose>
            <Button loading={isPending} type="submit">
              Invite member
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  )
}
