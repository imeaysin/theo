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

const banUserSchema = z.object({
  banReason: z.string().max(500, "Reason must be 500 characters or fewer."),
})

type BanUserValues = z.infer<typeof banUserSchema>

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type BanUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  userLabel: string
  onSubmit: (values: BanUserValues) => Promise<void> | void
}

// ---------------------------------------------------------------------------
// BanUserDialog
// ---------------------------------------------------------------------------

export function BanUserDialog({
  open,
  onOpenChange,
  userLabel,
  onSubmit,
}: BanUserDialogProps) {
  const form = useForm<BanUserValues>({
    resolver: zodResolver(banUserSchema),
    defaultValues: { banReason: "" },
  })

  const isSubmitting = form.formState.isSubmitting

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) form.reset()
    onOpenChange(nextOpen)
  }

  async function handleSubmit(values: BanUserValues) {
    await onSubmit(values)
    form.reset()
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right">
        <SheetHeader className="border-b px-6 pb-4">
          <SheetTitle>Ban user</SheetTitle>
          <SheetDescription>
            {userLabel} will be signed out and unable to sign in again until
            unbanned.
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
                name="banReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="Optional reason for audit"
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
              <Button
                disabled={isSubmitting}
                type="submit"
                variant="destructive"
              >
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                Ban user
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
