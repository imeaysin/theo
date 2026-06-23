import { useState } from "react"
import type * as React from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@workspace/ui/components/input-group"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardPanel, CardFooter } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"

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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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
    <Card className={cn("w-full max-w-sm sm:max-w-md", className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle>Set new password</CardTitle>
        <CardDescription>Choose a strong password for your account</CardDescription>
      </CardHeader>

      <CardPanel>
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
                <InputGroup>
                  <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                    minLength={8}
                    required
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isPending}
                    >
                      {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError />
              </Field>

              <Field>
                <FieldLabel>Confirm password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={isPending}
                    minLength={8}
                    required
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground"
                      onClick={() => setShowConfirm(!showConfirm)}
                      disabled={isPending}
                    >
                      {showConfirm ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                      <span className="sr-only">
                        {showConfirm ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError />
              </Field>

              <Button type="submit" loading={isPending} className="w-full">
                Update password
              </Button>
            </div>
          </Form>
        )}
      </CardPanel>

      {signInHref && (
        <CardFooter className="justify-center">
          <div className="text-sm text-muted-foreground">
            <a href={signInHref} className="hover:text-foreground hover:underline">
              Back to sign in
            </a>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
