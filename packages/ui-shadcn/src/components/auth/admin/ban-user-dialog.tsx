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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@workspace/ui-shadcn/components/dialog"

const banUserSchema = z.object({
  banReason: z.string().max(500, "Reason must be 500 characters or fewer."),
})

type BanUserValues = z.infer<typeof banUserSchema>

export type BanUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  userLabel: string
  onSubmit: (values: BanUserValues) => Promise<void> | void
}

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ban user</DialogTitle>
              <DialogDescription>
                {userLabel} will be signed out and unable to sign in again until
                unbanned.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
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

            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isSubmitting} type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                disabled={isSubmitting}
                type="submit"
                variant="destructive"
              >
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                Ban user
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  )
}
