"use client"

import type { OrganizationPermissionMap } from "@workspace/auth/permissions/organization"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@workspace/ui-shadcn/components/button"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui-shadcn/components/form"
import { Input } from "@workspace/ui-shadcn/components/input"
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

const createOrganizationRoleSchema = z.object({
  role: z
    .string()
    .min(1, "Role name is required.")
    .max(50, "Role name must be 50 characters or fewer.")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Role name may only contain letters, numbers, and hyphens."
    ),
  permission: z.custom<OrganizationPermissionMap>(
    (val) => typeof val === "object" && val !== null,
    "Permissions must be a valid permission map."
  ),
})

type CreateOrganizationRoleValues = {
  role: string
  permission: OrganizationPermissionMap
}

export type CreateOrganizationRoleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultPermissions?: OrganizationPermissionMap
  onSubmit: (values: CreateOrganizationRoleValues) => Promise<void> | void
}

export function CreateOrganizationRoleDialog({
  open,
  onOpenChange,
  defaultPermissions = EMPTY_PERMISSIONS,
  onSubmit,
}: CreateOrganizationRoleDialogProps) {
  const form = useForm<CreateOrganizationRoleValues>({
    resolver: zodResolver(createOrganizationRoleSchema),
    defaultValues: { role: "", permission: defaultPermissions },
  })

  const isSubmitting = form.formState.isSubmitting

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) form.reset()
    onOpenChange(nextOpen)
  }

  async function handleSubmit(values: CreateOrganizationRoleValues) {
    await onSubmit(values)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create role</DialogTitle>
          <DialogDescription>
            Add a custom role with create, read, update, and delete access.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4 py-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        disabled={isSubmitting}
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
                  <FormItem>
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
                Create role
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
