"use client"

import type { OrganizationPermissionMap } from "@workspace/auth/permissions/organization"
import { formatOrganizationRoleLabel } from "@workspace/auth/permissions/organization"
import type { OrganizationRole } from "@workspace/auth/types/organization"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@workspace/ui-shadcn/components/button"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui-shadcn/components/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@workspace/ui-shadcn/components/dialog"
import { OrganizationRolePermissions } from "./organization-role-permissions"

const EMPTY_PERMISSIONS: OrganizationPermissionMap = {}

/**
 * @description Schema & types
 */

const editOrganizationRoleSchema = z.object({
  permission: z.custom<OrganizationPermissionMap>(
    (val) => typeof val === "object" && val !== null,
    "Permissions must be a valid permission map."
  ),
})

type EditOrganizationRoleValues = {
  permission: OrganizationPermissionMap
}

/**
 * @description Public types
 */

export type EditOrganizationRoleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: OrganizationRole | null
  onSubmit: (values: EditOrganizationRoleValues) => Promise<void> | void
}

/**
 * @description EditOrganizationRoleDialog
 */

export function EditOrganizationRoleDialog({
  open,
  onOpenChange,
  role,
  onSubmit,
}: EditOrganizationRoleDialogProps) {
  const form = useForm<EditOrganizationRoleValues>({
    resolver: zodResolver(editOrganizationRoleSchema),
    defaultValues: {
      permission: role?.permission ?? EMPTY_PERMISSIONS,
    },
  })

  const isSubmitting = form.formState.isSubmitting

  // Sync form defaults when the role changes (e.g. opening a different role).
  useEffect(() => {
    if (role) {
      form.reset({
        permission: role.permission ?? EMPTY_PERMISSIONS,
      })
    }
  }, [role, form])

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) form.reset()
    onOpenChange(nextOpen)
  }

  async function handleSubmit(values: EditOrganizationRoleValues) {
    await onSubmit(values)
  }

  if (!role) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit role</DialogTitle>
              <DialogDescription>
                Update permissions for {formatOrganizationRoleLabel(role.role)}.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <FormField
                control={form.control}
                name="permission"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <OrganizationRolePermissions
                        disabled={isSubmitting}
                        onChange={field.onChange}
                        permissions={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isSubmitting} type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  )
}
