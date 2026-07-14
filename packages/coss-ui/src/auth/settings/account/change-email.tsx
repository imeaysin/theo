"use client"

import { Button } from "@workspace/ui/components/button"
import { Card, CardFooter, CardPanel } from "@workspace/ui/components/card"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { Controller, useFormState, type Control } from "react-hook-form"

type ChangeEmailValues = { email: string }

export type ChangeEmailProps = {
  className?: string
  control?: Control<ChangeEmailValues>
  onSubmit?: () => void
  isPending?: boolean
  hasSession?: boolean
}

export function ChangeEmail({
  className,
  control,
  onSubmit,
  isPending = false,
  hasSession = false,
}: ChangeEmailProps) {
  const wired = onSubmit != null && control != null
  const { errors } = useFormState({ control, disabled: !control })

  const formErrors: Record<string, string> = {}
  if (errors.email?.message) {
    formErrors.email = errors.email.message
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">Change email</h2>
      <Form
        errors={Object.keys(formErrors).length > 0 ? formErrors : undefined}
        onSubmit={onSubmit ?? ((event) => event.preventDefault())}
      >
        <Card className={cn(className)}>
          <CardPanel className="flex flex-col gap-6">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Field name="email">
                  <FieldLabel htmlFor="email">Email</FieldLabel>

                  {hasSession && wired ? (
                    <Input
                      {...field}
                      autoComplete="email"
                      disabled={isPending}
                      id="email"
                      placeholder="you@example.com"
                      type="email"
                    />
                  ) : (
                    <Skeleton>
                      <Input className="invisible" nativeInput />
                    </Skeleton>
                  )}

                  <FieldError />
                </Field>
              )}
            />
          </CardPanel>

          <CardFooter>
            <Button
              disabled={!hasSession || !wired}
              loading={isPending}
              size="sm"
              type="submit"
            >
              Update email
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  )
}
