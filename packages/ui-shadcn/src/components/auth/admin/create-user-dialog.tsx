"use client"

import type { PlatformRoleName } from "@workspace/auth/types"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui-shadcn/components/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@workspace/ui-shadcn/components/sheet"

// ---------------------------------------------------------------------------
// Schema & types
// ---------------------------------------------------------------------------

const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must be 128 characters or fewer."),
  role: z.string().min(1, "Please select a role."),
})

type CreateUserValues = z.infer<typeof createUserSchema>

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type CreateUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  roles: readonly PlatformRoleName[]
  formatRoleLabel: (role: PlatformRoleName) => string
  onSubmit: (values: CreateUserValues) => Promise<void> | void
}

// ---------------------------------------------------------------------------
// CreateUserDialog
// ---------------------------------------------------------------------------

export function CreateUserDialog({
  open,
  onOpenChange,
  roles,
  formatRoleLabel,
  onSubmit,
}: CreateUserDialogProps) {
  const form = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: roles[0] ?? "",
    },
  })

  const isSubmitting = form.formState.isSubmitting

  const roleItems = roles.map((roleName) => ({
    value: roleName,
    label: formatRoleLabel(roleName),
  }))

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) form.reset()
    onOpenChange(nextOpen)
  }

  async function handleSubmit(values: CreateUserValues) {
    await onSubmit(values)
    form.reset()
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right">
        <SheetHeader className="border-b px-6 pb-4">
          <SheetTitle>Create user</SheetTitle>
          <SheetDescription>
            Add a platform user with email and password credentials.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            className="flex min-h-0 flex-1 flex-col"
            noValidate
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                  <FormItem className="w-full">
                    <FormLabel>Platform role</FormLabel>
                    <Select
                      disabled={isSubmitting || roleItems.length === 0}
                      onValueChange={field.onChange}
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

            <SheetFooter className="border-t px-6 py-4">
              <SheetClose asChild>
                <Button disabled={isSubmitting} type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                Create user
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
