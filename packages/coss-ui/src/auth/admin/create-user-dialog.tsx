"use client"

import type { PlatformRoleName } from "@workspace/auth/types"
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

type CreateUserValues = {
  email: string
  name: string
  password: string
  role: PlatformRoleName
}

export type CreateUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  control: Control<CreateUserValues>
  roles: readonly PlatformRoleName[]
  formatRoleLabel: (role: PlatformRoleName) => string
  onSubmit: () => void
  isPending?: boolean
}

export function CreateUserDialog({
  open,
  onOpenChange,
  control,
  roles,
  formatRoleLabel,
  onSubmit,
  isPending = false,
}: CreateUserDialogProps) {
  const { errors } = useFormState({ control })
  const fieldsDisabled = isPending
  const roleItems = roles.map((roleName) => ({
    value: roleName,
    label: formatRoleLabel(roleName),
  }))

  const formErrors: Record<string, string> = {}
  if (errors.email?.message) formErrors.email = errors.email.message
  if (errors.name?.message) formErrors.name = errors.name.message
  if (errors.password?.message) formErrors.password = errors.password.message
  if (errors.role?.message) formErrors.role = errors.role.message

  return (
    <Pane onOpenChange={onOpenChange} open={open}>
      <Pane.Content>
        <Pane.Header>
          <Pane.Title>Create user</Pane.Title>
          <Pane.Description>
            Add a platform user with email and password credentials.
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
              name="name"
              render={({ field }) => (
                <Field name="name">
                  <FieldLabel htmlFor="create-user-name">Name</FieldLabel>
                  <Input
                    {...field}
                    autoFocus
                    disabled={fieldsDisabled}
                    id="create-user-name"
                    placeholder="Jane Doe"
                  />
                  <FieldError />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Field name="email">
                  <FieldLabel htmlFor="create-user-email">Email</FieldLabel>
                  <Input
                    {...field}
                    disabled={fieldsDisabled}
                    id="create-user-email"
                    placeholder="name@example.com"
                    type="email"
                  />
                  <FieldError />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Field name="password">
                  <FieldLabel htmlFor="create-user-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    disabled={fieldsDisabled}
                    id="create-user-password"
                    type="password"
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
                  <FieldLabel htmlFor="create-user-role">
                    Platform role
                  </FieldLabel>
                  <Select
                    disabled={fieldsDisabled || roleItems.length === 0}
                    items={roleItems}
                    onValueChange={(item) =>
                      field.onChange(item?.value ?? "user")
                    }
                    value={
                      roleItems.find((item) => item.value === field.value) ??
                      null
                    }
                  >
                    <SelectTrigger className="w-full" id="create-user-role">
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
              Create user
            </Button>
          </Pane.Footer>
        </Form>
      </Pane.Content>
    </Pane>
  )
}
