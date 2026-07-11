"use client"

import type { OrganizationPermissionMap } from "@workspace/auth/permissions/organization"
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
  FormLabel,
  FormMessage,
} from "@workspace/ui-shadcn/components/form"
import { Input } from "@workspace/ui-shadcn/components/input"
import { type UseFormReturn } from "react-hook-form"
import { OrganizationRolePermissions } from "./organization-role-permissions"

type CreateOrganizationRoleValues = {
  role: string
  permission: OrganizationPermissionMap
}

export type CreateOrganizationRoleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<CreateOrganizationRoleValues>
  onSubmit: () => void
  isPending?: boolean
}

export function CreateOrganizationRoleDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isPending = false,
}: CreateOrganizationRoleDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create role</DialogTitle>
          <DialogDescription>
            Add a custom role with create, read, update, and delete access.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex min-h-0 min-w-0 flex-1 flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex w-full min-w-0 flex-col gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="w-full items-stretch">
                    <FormLabel>Role name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        disabled={isPending}
                        placeholder="moderator"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                Create role
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
