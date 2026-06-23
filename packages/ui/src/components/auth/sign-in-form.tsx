import { useState } from "react"
import type * as React from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@workspace/ui/components/input-group"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardPanel } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export interface SignInFormProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  /** Called when form is submitted with email and password */
  onSubmit: (values: {
    email: string
    password: string
  }) => Promise<void> | void
  /** Called when social button is clicked */
  onSocialSignIn?: (provider: "google" | "github" | "apple") => Promise<void> | void
  /** Whether the submission is in progress */
  isPending?: boolean
  /** Server-side error message to display */
  error?: string
  /** Href for "Forgot password?" link */
  forgotPasswordHref?: string
  /** Href for "Sign up" link */
  signUpHref?: string
}

export function SignInForm({
  onSubmit,
  onSocialSignIn,
  isPending = false,
  error,
  forgotPasswordHref,
  signUpHref,
  className,
  ...props
}: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit({ email, password })
  }

  return (
    <Card className={cn("w-full max-w-sm sm:max-w-md", className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle>Welcome back</CardTitle>
        {signUpHref && (
          <CardDescription>
            Don&apos;t have an account?{" "}
            <a href={signUpHref} className="font-medium text-foreground hover:underline">
              Sign up
            </a>
          </CardDescription>
        )}
      </CardHeader>

      <CardPanel>
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

            <Field>
              <div className="flex w-full items-center justify-between">
                <FieldLabel>Password</FieldLabel>
                {forgotPasswordHref && (
                  <a
                    href={forgotPasswordHref}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <InputGroup>
                <InputGroupInput
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
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

            <Button type="submit" loading={isPending} className="w-full">
              Login
            </Button>
          </div>

          {onSocialSignIn && (
            <>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:-translate-y-1/2 after:-mx-0 after:block after:border-t after:border-border">
                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                  Or
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Button variant="outline" type="button" onClick={() => onSocialSignIn("apple")} disabled={isPending}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 size-4">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="currentColor" />
                  </svg>
                  Apple
                </Button>
                <Button variant="outline" type="button" onClick={() => onSocialSignIn("google")} disabled={isPending}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 size-4">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                  </svg>
                  Google
                </Button>
              </div>
            </>
          )}
        </Form>
      </CardPanel>

      <div className="pb-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our <a href="#" className="hover:text-foreground hover:underline underline-offset-4">Terms of Service</a>{" "}
        and <a href="#" className="hover:text-foreground hover:underline underline-offset-4">Privacy Policy</a>.
      </div>
    </Card>
  )
}
