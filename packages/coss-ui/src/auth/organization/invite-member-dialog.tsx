"use client"

import { Button } from "@workspace/ui/components/button"
import { Pane } from "@workspace/ui/components/pane"
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
import { Controller, useFormState, type Control } from "react-hook-form"

type InviteMemberValues = { email: string; role: string }

export type InviteMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  control: Control<InviteMemberValues>
  roles: string[]
  formatRoleLabel: (role: string) => string
  onSubmit: () => void
  isPending?: boolean
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  control,
  roles,
  formatRoleLabel,
  onSubmit,
  isPending = false,
}: InviteMemberDialogProps) {
  const { errors } = useFormState({ control })
  const fieldsDisabled = isPending
  const roleItems = roles.map((roleName) => ({
    value: roleName,
    label: formatRoleLabel(roleName),
  }))

  const formErrors: Record<string, string> = {}
  if (errors.email?.message) formErrors.email = errors.email.message
  if (errors.role?.message) formErrors.role = errors.role.message

  return (
    <Pane onOpenChange={onOpenChange} open={open}>
      <Pane.Content>
        <Pane.Header>
          <Pane.Title>Invite member</Pane.Title>
          <Pane.Description>
            Send an invitation to join this workspace.
          </Pane.Description>
        </Pane.Header>

        <Form
          className="contents"
          errors={Object.keys(formErrors).length > 0 ? formErrors : undefined}
          onSubmit={onSubmit}
        >
          <Pane.Panel className="flex flex-col gap-4">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Field name="email">
                  <FieldLabel htmlFor="invite-member-email">Email</FieldLabel>
                  <Input
                    {...field}
                    autoFocus
                    disabled={fieldsDisabled}
                    id="invite-member-email"
                    placeholder="name@example.com"
                    type="email"
                  />
                  <FieldError />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Field className="w-full" name="role">
                  <FieldLabel htmlFor="invite-member-role">Role</FieldLabel>
                  <Select
                    disabled={fieldsDisabled || roleItems.length === 0}
                    items={roleItems}
                    onValueChange={(item) => field.onChange(item?.value ?? "")}
                    value={
                      roleItems.find((item) => item.value === field.value) ??
                      null
                    }
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
                  <FieldError />
                </Field>
              )}
            />
          </Pane.Panel>

          <Pane.Footer>
            <Pane.Close
              render={
                <Button disabled={isPending} type="button" variant="outline" />
              }
            >
              Cancel
            </Pane.Close>
            <Button loading={isPending} type="submit">
              Invite member
            </Button>
          </Pane.Footer>
        </Form>
      </Pane.Content>
    </Pane>
  )
}
