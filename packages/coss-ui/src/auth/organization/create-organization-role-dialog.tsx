"use client"

import type { OrganizationPermissionMap } from "@workspace/auth/permissions/organization"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Pane } from "@workspace/ui/components/pane"
import { Controller, useFormState, type Control } from "react-hook-form"
import { OrganizationRolePermissions } from "./organization-role-permissions"

type CreateOrganizationRoleValues = {
  role: string
  permission: OrganizationPermissionMap
}

export type CreateOrganizationRoleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  control: Control<CreateOrganizationRoleValues>
  onSubmit: () => void
  isPending?: boolean
}

export function CreateOrganizationRoleDialog({
  open,
  onOpenChange,
  control,
  onSubmit,
  isPending = false,
}: CreateOrganizationRoleDialogProps) {
  const { errors } = useFormState({ control })

  const formErrors: Record<string, string> = {}
  if (errors.role?.message) formErrors.role = errors.role.message
  if (errors.permission?.message)
    formErrors.permission = errors.permission.message

  return (
    <Pane onOpenChange={onOpenChange} open={open}>
      <Pane.Content>
        <Pane.Header>
          <Pane.Title>Create role</Pane.Title>
          <Pane.Description>
            Add a custom role with create, read, update, and delete access.
          </Pane.Description>
        </Pane.Header>

        <Form
          className="flex min-h-0 min-w-0 flex-1 flex-col"
          errors={formErrors}
          noValidate
          onSubmit={onSubmit}
        >
          <Pane.Panel className="flex w-full min-w-0 flex-col gap-4">
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Field className="w-full items-stretch" name="role">
                  <FieldLabel htmlFor="create-organization-role-name">
                    Role name
                  </FieldLabel>
                  <FieldControl
                    {...field}
                    render={(controlProps) => (
                      <Input
                        {...controlProps}
                        autoFocus
                        disabled={isPending}
                        id="create-organization-role-name"
                        placeholder="moderator"
                      />
                    )}
                  />
                  <FieldError />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="permission"
              render={({ field }) => (
                <Field
                  className="w-full min-w-0 !items-stretch gap-2"
                  name="permission"
                >
                  <OrganizationRolePermissions
                    disabled={isPending}
                    onChange={field.onChange}
                    permissions={field.value}
                  />
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
              Create role
            </Button>
          </Pane.Footer>
        </Form>
      </Pane.Content>
    </Pane>
  )
}
