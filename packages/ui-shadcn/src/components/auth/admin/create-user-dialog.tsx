"use client"

import type { PlatformRoleName } from "@workspace/auth/types"
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
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui-shadcn/components/select"
import { type UseFormReturn } from "react-hook-form"

type CreateUserValues = {
  email: string
  name: string
  password: string
  role: PlatformRoleName
}

export type CreateUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<CreateUserValues>
  roles: readonly PlatformRoleName[]
  formatRoleLabel: (role: PlatformRoleName) => string
  onSubmit: () => void
  isPending?: boolean
}

export function CreateUserDialog({
  open,
  onOpenChange,
  form,
  roles,
  formatRoleLabel,
  onSubmit,
  isPending = false,
}: CreateUserDialogProps) {
  const fieldsDisabled = isPending
  const roleItems = roles.map((roleName) => ({
    value: roleName,
    label: formatRoleLabel(roleName),
  }))

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Add a platform user with email and password credentials.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        disabled={fieldsDisabled}
                        placeholder="Jane Doe"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={fieldsDisabled}
                        placeholder="name@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={fieldsDisabled}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform role</FormLabel>
                    <Select
                      disabled={fieldsDisabled || roleItems.length === 0}
                      onValueChange={(val) => field.onChange(val)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                Create user
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
