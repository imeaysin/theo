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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@workspace/ui-shadcn/components/sheet"
import { OrganizationRolePermissions } from "./organization-role-permissions"

// ---------------------------------------------------------------------------
// Schema & types
// ---------------------------------------------------------------------------

const editOrganizationRoleSchema = z.object({
  permission: z.custom<OrganizationPermissionMap>(
    (val) => typeof val === "object" && val !== null,
    "Permissions must be a valid permission map."
  ),
})

type EditOrganizationRoleValues = {
  permission: OrganizationPermissionMap
}

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type EditOrganizationRoleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: OrganizationRole | null
  onSubmit: (values: EditOrganizationRoleValues) => Promise<void> | void
}

// ---------------------------------------------------------------------------
// EditOrganizationRoleDialog
// ---------------------------------------------------------------------------

export function EditOrganizationRoleDialog({
  open,
  onOpenChange,
  role,
  onSubmit,
}: EditOrganizationRoleDialogProps) {
  const form = useForm<EditOrganizationRoleValues>({
    resolver: zodResolver(editOrganizationRoleSchema),
    defaultValues: {
      permission: role?.permissions ?? ({} as OrganizationPermissionMap),
    },
  })

  const isSubmitting = form.formState.isSubmitting

  // Sync form defaults when the role changes (e.g. opening a different role).
  useEffect(() => {
    if (role) {
      form.reset({
        permission: role.permissions ?? ({} as OrganizationPermissionMap),
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
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right">
        <SheetHeader className="border-b px-6 pb-4">
          <SheetTitle>Edit role</SheetTitle>
          <SheetDescription>
            Update permissions for {formatOrganizationRoleLabel(role.role)}.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            className="flex min-h-0 flex-1 flex-col"
            noValidate
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="flex flex-1 overflow-y-auto p-6">
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

            <SheetFooter className="border-t px-6 py-4">
              <SheetClose asChild>
                <Button disabled={isSubmitting} type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                Save changes
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
