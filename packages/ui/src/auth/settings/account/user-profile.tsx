"use client"

import { Button } from "@workspace/ui/components/button"
import { Card, CardFooter, CardPanel } from "@workspace/ui/components/card"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

export interface UserProfileProps {
  className?: string
  name?: string
  onNameChange?: (value: string) => void
  nameError?: string
  onSubmit?: () => void
  isPending?: boolean
  hasSession?: boolean
}

export function UserProfile({
  className,
  name = "",
  onNameChange,
  nameError,
  onSubmit,
  isPending = false,
  hasSession = false,
}: UserProfileProps) {
  const wired = onSubmit != null

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">Profile</h2>
      <Form onSubmit={onSubmit ?? ((event) => event.preventDefault())}>
        <Card className={cn(className)}>
          <CardPanel className="flex flex-col gap-6">
            <Field invalid={Boolean(nameError)}>
              <FieldLabel htmlFor="name">Name</FieldLabel>

              {hasSession && wired ? (
                <Input
                  autoComplete="name"
                  disabled={isPending}
                  id="name"
                  onChange={(event) => onNameChange?.(event.target.value)}
                  placeholder="Your name"
                  type="text"
                  value={name}
                />
              ) : (
                <Skeleton>
                  <Input className="invisible" nativeInput />
                </Skeleton>
              )}

              <FieldError match={Boolean(nameError)}>{nameError}</FieldError>
            </Field>
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
