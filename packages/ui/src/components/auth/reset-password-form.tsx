import { useState } from "react"
import type * as React from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { cn } from "@workspace/ui/lib/utils"

export interface ResetPasswordFormProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  /** Called when form is submitted with the new password */
  onSubmit: (values: { password: string }) => Promise<void> | void
  /** Whether the submission is in progress */
  isPending?: boolean
  /** Server-side error message */
  error?: string
  /** Shown instead of the form on success */
  successMessage?: string
  /** Href for "Back to sign in" link */
  signInHref?: string
}

export function ResetPasswordForm({
  onSubmit,
  isPending = false,
  error,
  successMessage,
  signInHref,
  className,
  ...props
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError(null)

    if (password !== confirm) {
      setLocalError("Passwords do not match.")
      return
    }

    await onSubmit({ password })
  }

  const displayError = error ?? localError

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">

        <h1 className="text-xl font-bold">Set new password</h1>
        <div className="text-sm text-muted-foreground">
          Choose a strong password for your account
        </div>
      </div>

      {successMessage ? (
        <Alert variant="success">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : (
        <Form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
          {displayError && (
            <Alert variant="error">
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel>New password</FieldLabel>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                minLength={8}
                required
              />
              <FieldError />
            </Field>

            <Field>
              <FieldLabel>Confirm password</FieldLabel>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={isPending}
                minLength={8}
                required
              />
              <FieldError />
            </Field>

            <Button type="submit" loading={isPending} className="w-full">
              Update password
            </Button>
          </div>
        </Form>
      )}

      {signInHref && (
        <div className="text-center text-sm text-muted-foreground">
          <a href={signInHref} className="hover:text-foreground hover:underline">
            Back to sign in
          </a>
        </div>
      )}
    </div>
  )
}
