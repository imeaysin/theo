"use client"

import type { SubmitEventHandler } from "react"
import type { OrganizationPermissionMap } from "@workspace/auth/permissions/organization"
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
import { OrganizationRolePermissions } from "./organization-role-permissions"

export interface CreateOrganizationRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: string
  onRoleChange: (value: string) => void
  roleError?: string
  permissions: OrganizationPermissionMap
  onPermissionsChange: (permissions: OrganizationPermissionMap) => void
  permissionError?: string
  onSubmit: SubmitEventHandler<HTMLFormElement>
  isPending?: boolean
}

export function CreateOrganizationRoleDialog({
  open,
  onOpenChange,
  role,
  onRoleChange,
  roleError,
  permissions,
  onPermissionsChange,
  permissionError,
  onSubmit,
  isPending = false,
}: CreateOrganizationRoleDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPopup className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create role</DialogTitle>
          <DialogDescription>
            Define a custom role with specific permissions for this workspace.
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
            <Field invalid={Boolean(roleError)}>
              <FieldLabel htmlFor="create-organization-role-name">
                Role name
              </FieldLabel>
              <Input
                autoFocus
                disabled={isPending}
                id="create-organization-role-name"
                onChange={(event) => onRoleChange(event.target.value)}
                placeholder="moderator"
                value={role}
              />
              <FieldError match={Boolean(roleError)}>{roleError}</FieldError>
            </Field>

            <Field invalid={Boolean(permissionError)}>
              <FieldLabel>Permissions</FieldLabel>
              <OrganizationRolePermissions
                disabled={isPending}
                onChange={onPermissionsChange}
                permissions={permissions}
              />
              <FieldError match={Boolean(permissionError)}>
                {permissionError}
              </FieldError>
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
              Create role
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  )
}
