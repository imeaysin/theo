"use client"

import { Button } from "@workspace/ui/components/button"
import { Pane } from "@workspace/ui/components/pane"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Controller, useFormState, type Control } from "react-hook-form"

type BanUserValues = {
  banReason: string
}

export type BanUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  control: Control<BanUserValues>
  userLabel: string
  onSubmit: () => void
  isPending?: boolean
}

export function BanUserDialog({
  open,
  onOpenChange,
  control,
  userLabel,
  onSubmit,
  isPending = false,
}: BanUserDialogProps) {
  const { errors } = useFormState({ control })
  const formErrors: Record<string, string> = {}
  if (errors.banReason?.message) formErrors.banReason = errors.banReason.message

  return (
    <Pane onOpenChange={onOpenChange} open={open}>
      <Pane.Content>
        <Pane.Header>
          <Pane.Title>Ban user</Pane.Title>
          <Pane.Description>
            {userLabel} will be signed out and unable to sign in again until
            unbanned.
          </Pane.Description>
        </Pane.Header>

        <Form
          className="contents"
          errors={Object.keys(formErrors).length > 0 ? formErrors : undefined}
          onSubmit={onSubmit}
        >
          <Pane.Panel>
            <Controller
              control={control}
              name="banReason"
              render={({ field }) => (
                <Field name="banReason">
                  <FieldLabel htmlFor="ban-user-reason">Reason</FieldLabel>
                  <Input
                    {...field}
                    disabled={isPending}
                    id="ban-user-reason"
                    placeholder="Optional reason for audit"
                  />
                  <FieldError />
                </Field>
              )}
            />
          </Pane.Panel>

          <Pane.Footer>
            <Pane.Close
              render={
                <Button disabled={isPending} type="button" variant="outline" />
              }
            >
              Cancel
            </Pane.Close>
            <Button loading={isPending} type="submit" variant="destructive">
              Ban user
            </Button>
          </Pane.Footer>
        </Form>
      </Pane.Content>
    </Pane>
  )
}
