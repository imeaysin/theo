"use client"

import {
  useAuthUiConfig,
  useChangePassword,
  useListAccounts,
  useRequestPasswordReset,
  useAuthSession,
} from "@workspace/auth/react"
import { type SyntheticEvent, useState } from "react"
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

export interface ChangePasswordProps {
  className?: string
}

const MIN_PASSWORD_LENGTH = 8

export function ChangePassword({ className }: ChangePasswordProps) {
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
      session={isAccountsPending ? undefined : session}
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
            type: "success",
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
  session,
}: {
  className?: string
  session: ReturnType<typeof useAuthSession>["data"] | undefined
}) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})

  const { mutate: changePassword, isPending } = useChangePassword()

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setFieldErrors({
        confirmPassword: "Passwords do not match",
      })
      return
    }

    changePassword(
      {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      },
      {
        onError: () => {
          setFieldErrors({
            currentPassword: "Check your current password and try again.",
          })
          setCurrentPassword("")
        },
        onSuccess: () => {
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
          toastManager.add({
            title: "Password updated",
            type: "success",
          })
        },
      }
    )
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">Change password</h2>

      <Form onSubmit={handleSubmit}>
        <Card className={cn(className)}>
          <CardPanel className="flex flex-col gap-6">
            <Field invalid={Boolean(fieldErrors.currentPassword)}>
              <FieldLabel htmlFor="currentPassword">
                Current password
              </FieldLabel>

              {session ? (
                <FieldControl
                  render={(controlProps) => (
                    <PasswordInput
                      {...controlProps}
                      autoComplete="current-password"
                      disabled={isPending}
                      id="currentPassword"
                      name="currentPassword"
                      onChange={(e) => {
                        setCurrentPassword(e.target.value)
                        setFieldErrors((prev) => ({
                          ...prev,
                          currentPassword: undefined,
                        }))
                      }}
                      onInvalid={(e) => {
                        e.preventDefault()
                        setFieldErrors((prev) => ({
                          ...prev,
                          currentPassword: (e.target as HTMLInputElement)
                            .validationMessage,
                        }))
                      }}
                      placeholder="Enter your current password"
                      required
                      value={currentPassword}
                    />
                  )}
                />
              ) : (
                <Skeleton>
                  <Input className="invisible" nativeInput />
                </Skeleton>
              )}

              <FieldError match={Boolean(fieldErrors.currentPassword)}>
                {fieldErrors.currentPassword}
              </FieldError>
            </Field>

            <Field invalid={Boolean(fieldErrors.newPassword)}>
              <FieldLabel htmlFor="newPassword">New password</FieldLabel>

              {session ? (
                <FieldControl
                  render={(controlProps) => (
                    <PasswordInput
                      {...controlProps}
                      autoComplete="new-password"
                      disabled={isPending}
                      id="newPassword"
                      minLength={MIN_PASSWORD_LENGTH}
                      name="newPassword"
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        setFieldErrors((prev) => ({
                          ...prev,
                          newPassword: undefined,
                        }))
                      }}
                      onInvalid={(e) => {
                        e.preventDefault()
                        setFieldErrors((prev) => ({
                          ...prev,
                          newPassword: (e.target as HTMLInputElement)
                            .validationMessage,
                        }))
                      }}
                      placeholder="Enter a new password"
                      required
                      value={newPassword}
                    />
                  )}
                />
              ) : (
                <Skeleton>
                  <Input className="invisible" nativeInput />
                </Skeleton>
              )}

              <FieldError match={Boolean(fieldErrors.newPassword)}>
                {fieldErrors.newPassword}
              </FieldError>
            </Field>

            <Field invalid={Boolean(fieldErrors.confirmPassword)}>
              <FieldLabel htmlFor="confirmPassword">
                Confirm password
              </FieldLabel>

              {session ? (
                <FieldControl
                  render={(controlProps) => (
                    <PasswordInput
                      {...controlProps}
                      autoComplete="new-password"
                      disabled={isPending}
                      id="confirmPassword"
                      minLength={MIN_PASSWORD_LENGTH}
                      name="confirmPassword"
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setFieldErrors((prev) => ({
                          ...prev,
                          confirmPassword: undefined,
                        }))
                      }}
                      onInvalid={(e) => {
                        e.preventDefault()
                        setFieldErrors((prev) => ({
                          ...prev,
                          confirmPassword: (e.target as HTMLInputElement)
                            .validationMessage,
                        }))
                      }}
                      placeholder="Confirm your password"
                      required
                      value={confirmPassword}
                    />
                  )}
                />
              ) : (
                <Skeleton>
                  <Input className="invisible" nativeInput />
                </Skeleton>
              )}

              <FieldError match={Boolean(fieldErrors.confirmPassword)}>
                {fieldErrors.confirmPassword}
              </FieldError>
            </Field>
          </CardPanel>

          <CardFooter>
            <Button
              disabled={!session}
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
