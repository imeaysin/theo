"use client"

import type { SubmitEventHandler } from "react"
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
  SelectItem,
  SelectPopup,
  SelectTrigger,
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
  onSubmit: SubmitEventHandler<HTMLFormElement>
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
  onSubmit,
  isPending = false,
}: InviteMemberDialogProps) {
  const fieldsDisabled = isPending
  const roleItems = roles.map((roleName) => ({
    value: roleName,
    label: formatRoleLabel(roleName),
  }))

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>
            Send an invitation to join this workspace.
          </DialogDescription>
        </DialogHeader>

        <Form
          className="contents"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit(event)
          }}
        >
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

            <Field className="w-full" data-invalid={!!roleError}>
              <FieldLabel htmlFor="invite-member-role">Role</FieldLabel>
              <Select
                disabled={fieldsDisabled || roleItems.length === 0}
                items={roleItems}
                onValueChange={(item) => onRoleChange(item?.value ?? "")}
                value={roleItems.find((item) => item.value === role) ?? null}
              >
                <SelectTrigger className="w-full" id="invite-member-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectPopup alignItemWithTrigger={false}>
                  {roleItems.map((item) => (
                    <SelectItem key={item.value} value={item}>
                      {item.label}
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
