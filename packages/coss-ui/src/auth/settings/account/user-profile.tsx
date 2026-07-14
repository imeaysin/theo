"use client"

import { Button } from "@workspace/ui/components/button"
import { Card, CardFooter, CardPanel } from "@workspace/ui/components/card"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { Controller, useFormState, type Control } from "react-hook-form"

type UserProfileValues = { name: string }

export type UserProfileProps = {
  className?: string
  control?: Control<UserProfileValues>
  onSubmit?: () => void
  isPending?: boolean
  hasSession?: boolean
}

export function UserProfile({
  className,
  control,
  onSubmit,
  isPending = false,
  hasSession = false,
}: UserProfileProps) {
  const wired = onSubmit != null && control != null
  const { errors } = useFormState({ control, disabled: !control })

  const formErrors: Record<string, string> = {}
  if (errors.name?.message) {
    formErrors.name = errors.name.message
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">Profile</h2>
      <Form
        errors={Object.keys(formErrors).length > 0 ? formErrors : undefined}
        onSubmit={onSubmit ?? ((event) => event.preventDefault())}
      >
        <Card className={cn(className)}>
          <CardPanel className="flex flex-col gap-6">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Field name="name">
                  <FieldLabel htmlFor="name">Name</FieldLabel>

                  {hasSession && wired ? (
                    <Input
                      {...field}
                      autoComplete="name"
                      disabled={isPending}
                      id="name"
                      placeholder="Your name"
                      type="text"
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
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  )
}
