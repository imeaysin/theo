"use client"

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

type BanUserValues = {
  banReason: string
}

export type BanUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<BanUserValues>
  userLabel: string
  onSubmit: () => void
  isPending?: boolean
}

export function BanUserDialog({
  open,
  onOpenChange,
  form,
  userLabel,
  onSubmit,
  isPending = false,
}: BanUserDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban user</DialogTitle>
          <DialogDescription>
            {userLabel} will be signed out and unable to sign in again until
            unbanned.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="banReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Optional reason for audit"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isPending} type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit" variant="destructive">
                Ban user
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
