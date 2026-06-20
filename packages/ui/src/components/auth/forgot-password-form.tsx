import { useState } from "react"
import type * as React from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardPanel,
  CardFooter,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

export interface ForgotPasswordFormProps extends Omit<
  React.ComponentProps<"div">,
  "onSubmit"
> {
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
    <Card className={cn("w-full max-w-sm sm:max-w-md", className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link
        </CardDescription>
      </CardHeader>

      <CardPanel>
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
      </CardPanel>

      {signInHref && (
        <CardFooter className="justify-center">
          <div className="text-sm text-muted-foreground">
            <a
              href={signInHref}
              className="hover:text-foreground hover:underline"
            >
              Back to sign in
            </a>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
