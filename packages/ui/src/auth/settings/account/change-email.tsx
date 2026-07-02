"use client"

import { Button } from "@workspace/ui/components/button"
import { Card, CardFooter, CardPanel } from "@workspace/ui/components/card"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

export interface ChangeEmailProps {
  className?: string
  email?: string
  onEmailChange?: (value: string) => void
  emailError?: string
  onSubmit?: () => void
  isPending?: boolean
  hasSession?: boolean
}

export function ChangeEmail({
  className,
  email = "",
  onEmailChange,
  emailError,
  onSubmit,
  isPending = false,
  hasSession = false,
}: ChangeEmailProps) {
  const wired = onSubmit != null

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">Change email</h2>
      <Form onSubmit={onSubmit ?? ((event) => event.preventDefault())}>
        <Card className={cn(className)}>
          <CardPanel className="flex flex-col gap-6">
            <Field invalid={Boolean(emailError)}>
              <FieldLabel htmlFor="email">Email</FieldLabel>

              {hasSession && wired ? (
                <Input
                  autoComplete="email"
                  disabled={isPending}
                  id="email"
                  onChange={(event) => onEmailChange?.(event.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                />
              ) : (
                <Skeleton>
                  <Input className="invisible" nativeInput />
                </Skeleton>
              )}

              <FieldError match={Boolean(emailError)}>{emailError}</FieldError>
            </Field>
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
