"use client"

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

const inviteMemberSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  role: z.string().min(1, "Please select a role."),
})

type InviteMemberValues = z.infer<typeof inviteMemberSchema>

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type InviteMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  roles: string[]
  formatRoleLabel: (role: string) => string
  onSubmit: (values: InviteMemberValues) => Promise<void> | void
}

// ---------------------------------------------------------------------------
// InviteMemberDialog
// ---------------------------------------------------------------------------

export function InviteMemberDialog({
  open,
  onOpenChange,
  roles,
  formatRoleLabel,
  onSubmit,
}: InviteMemberDialogProps) {
  const form = useForm<InviteMemberValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: "", role: roles[0] ?? "" },
  })

  const isSubmitting = form.formState.isSubmitting

  const roleItems = roles.map((roleName) => ({
    value: roleName,
    label: formatRoleLabel(roleName),
  }))

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) form.reset({ email: "", role: roles[0] ?? "" })
    onOpenChange(nextOpen)
  }

  async function handleSubmit(values: InviteMemberValues) {
    await onSubmit(values)
    form.reset({ email: "", role: roles[0] ?? "" })
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right">
        <SheetHeader className="border-b px-6 pb-4">
          <SheetTitle>Invite member</SheetTitle>
          <SheetDescription>
            Send an invitation to join this workspace.
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
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
                name="role"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Role</FormLabel>
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
                Invite member
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
