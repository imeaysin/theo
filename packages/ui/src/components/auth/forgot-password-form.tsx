import { useState } from "react"
import type * as React from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { cn } from "@workspace/ui/lib/utils"

export interface ForgotPasswordFormProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  /** Called when form is submitted with the email address */
  onSubmit: (values: { email: string }) => Promise<void> | void
  /** Whether the submission is in progress */
  isPending?: boolean
  /** Server-side error message */
  error?: string
  /** Shown instead of the form once the email has been sent */
  successMessage?: string
  /** Href for "Back to sign in" link */
  signInHref?: string
}

export function ForgotPasswordForm({
  onSubmit,
  isPending = false,
  error,
  successMessage,
  signInHref,
  className,
  ...props
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit({ email })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">

        <h1 className="text-xl font-bold">Forgot password?</h1>
        <div className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
        </div>
      </div>

      {successMessage ? (
        <Alert variant="success">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : (
        <Form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
          {error && (
            <Alert variant="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                required
              />
              <FieldError />
            </Field>

            <Button type="submit" loading={isPending} className="w-full">
              Send reset link
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
