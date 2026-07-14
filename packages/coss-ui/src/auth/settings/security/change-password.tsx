"use client"

import {
  useAuthUiConfig,
  useListAccounts,
  useRequestPasswordReset,
  useAuthSession,
} from "@workspace/auth/react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardFooter, CardPanel } from "@workspace/ui/components/card"
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { PasswordInput } from "@workspace/ui/components/password-input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toastManager } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import { Controller, useFormState, type Control } from "react-hook-form"

type ChangePasswordValues = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type ChangePasswordProps = {
  className?: string
  changePassword?: ChangePasswordFormProps
}

export type ChangePasswordFormProps = {
  className?: string
  control?: Control<ChangePasswordValues>
  onSubmit?: () => void
  isPending?: boolean
  hasSession?: boolean
}

export function ChangePassword({
  className,
  changePassword,
}: ChangePasswordProps) {
  const { data: session } = useAuthSession()
  const { data: accounts, isPending: isAccountsPending } = useListAccounts()

  const hasCredentialAccount = accounts?.some(
    (account) => account.providerId === "credential"
  )

  if (!isAccountsPending && !hasCredentialAccount) {
    return <SetPassword className={className} />
  }

  return (
    <ChangePasswordForm
      className={className}
      {...changePassword}
      hasSession={
        changePassword?.hasSession ?? (!isAccountsPending && !!session)
      }
    />
  )
}

function SetPassword({ className }: { className?: string }) {
  const config = useAuthUiConfig()
  const { data: session } = useAuthSession()
  const { mutate: requestPasswordReset, isPending } = useRequestPasswordReset()

  const handleSetPassword = () => {
    if (!session?.user.email) return
    requestPasswordReset(
      {
        email: session.user.email,
        redirectTo: config.absoluteAppUrl(config.routes.resetPassword),
      },
      {
        onSuccess: () => {
          toastManager.add({
            title: "Password reset email sent",
            description: "A reset link has been sent to your email.",
            type: "success",
          })
        },
        onError: () => {
          toastManager.add({
            title: "Could not send reset link",
            description: "Please try again.",
            type: "error",
          })
        },
      }
    )
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">Change password</h2>

      <Card className={cn(className)}>
        <CardPanel className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm leading-tight font-medium">Set a password</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              You signed in with a social account. Set a password to also sign
              in with email.
            </p>
          </div>

          <Button
            disabled={!session?.user.email}
            loading={isPending}
            onClick={handleSetPassword}
            size="sm"
            type="button"
          >
            Send reset link
          </Button>
        </CardPanel>
      </Card>
    </div>
  )
}

function ChangePasswordForm({
  className,
  control,
  onSubmit,
  isPending = false,
  hasSession = false,
}: ChangePasswordFormProps) {
  const wired = onSubmit != null && control != null
  const { errors } = useFormState({ control, disabled: !control })

  const formErrors: Record<string, string> = {}
  if (errors.currentPassword?.message) {
    formErrors.currentPassword = errors.currentPassword.message
  }
  if (errors.newPassword?.message)
    formErrors.newPassword = errors.newPassword.message
  if (errors.confirmPassword?.message) {
    formErrors.confirmPassword = errors.confirmPassword.message
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">Change password</h2>

      <Form
        errors={Object.keys(formErrors).length > 0 ? formErrors : undefined}
        onSubmit={onSubmit ?? ((event) => event.preventDefault())}
      >
        <Card className={cn(className)}>
          <CardPanel className="flex flex-col gap-6">
            <Controller
              control={control}
              name="currentPassword"
              render={({ field }) => (
                <Field name="currentPassword">
                  <FieldLabel htmlFor="currentPassword">
                    Current password
                  </FieldLabel>

                  {hasSession && wired ? (
                    <FieldControl
                      {...field}
                      render={(controlProps) => (
                        <PasswordInput
                          {...controlProps}
                          autoComplete="current-password"
                          disabled={isPending}
                          id="currentPassword"
                          placeholder="Enter your current password"
                        />
                      )}
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

            <Controller
              control={control}
              name="newPassword"
              render={({ field }) => (
                <Field name="newPassword">
                  <FieldLabel htmlFor="newPassword">New password</FieldLabel>

                  {hasSession && wired ? (
                    <FieldControl
                      {...field}
                      render={(controlProps) => (
                        <PasswordInput
                          {...controlProps}
                          autoComplete="new-password"
                          disabled={isPending}
                          id="newPassword"
                          placeholder="Enter a new password"
                        />
                      )}
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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <Field name="confirmPassword">
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm password
                  </FieldLabel>

                  {hasSession && wired ? (
                    <FieldControl
                      {...field}
                      render={(controlProps) => (
                        <PasswordInput
                          {...controlProps}
                          autoComplete="new-password"
                          disabled={isPending}
                          id="confirmPassword"
                          placeholder="Confirm your password"
                        />
                      )}
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
              Update password
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  )
}
