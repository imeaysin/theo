"use client"

import type { OrganizationPermissionMap } from "@workspace/auth/permissions/organization"
import { formatOrganizationRoleLabel } from "@workspace/auth/permissions/organization"
import type { OrganizationRole } from "@workspace/auth/types/organization"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@workspace/ui-shadcn/components/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui-shadcn/components/form"
import { type UseFormReturn } from "react-hook-form"
import { OrganizationRolePermissions } from "./organization-role-permissions"

type EditOrganizationRoleValues = {
  permission: OrganizationPermissionMap
}

export type EditOrganizationRoleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: OrganizationRole | null
  form: UseFormReturn<EditOrganizationRoleValues>
  onSubmit: () => void
  isPending?: boolean
}

export function EditOrganizationRoleDialog({
  open,
  onOpenChange,
  role,
  form,
  onSubmit,
  isPending = false,
}: EditOrganizationRoleDialogProps) {
  if (!role) return null

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit role</DialogTitle>
          <DialogDescription>
            Update permissions for {formatOrganizationRoleLabel(role.role)}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex min-h-0 min-w-0 flex-1 flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="w-full min-w-0">
              <FormField
                control={form.control}
                name="permission"
                render={({ field }) => (
                  <FormItem className="w-full min-w-0 items-stretch! gap-2">
                    <FormControl>
                      <OrganizationRolePermissions
                        disabled={isPending}
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
                <Button disabled={isPending} type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
