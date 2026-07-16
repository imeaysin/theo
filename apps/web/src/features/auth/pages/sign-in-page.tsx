import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "@workspace/auth/client"
import { SignInSchema, type SignInInput } from "@workspace/contracts"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui-shadcn/components/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui-shadcn/components/field"
import { Input } from "@workspace/ui-shadcn/components/input"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { routes, defaultAuthenticatedRoute } from "@/config/routes"
import { getSafeRedirectPath } from "@/routing/safe-redirect"
import { AuthDivider } from "@/features/auth/components/auth-divider"
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button"
import { buildAuthCallback } from "@/features/auth/lib/auth-callback"
import { resolveSignInFeedback } from "@/features/auth/lib/sign-in-feedback"

export function SignInPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [formError, setFormError] = useState<string | null>(null)
  const [verifyEmailHref, setVerifyEmailHref] = useState<string | null>(null)
  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  })

  const redirectPath = getSafeRedirectPath(
    searchParams.get("redirect"),
    defaultAuthenticatedRoute
  )

  async function onSubmit(values: SignInInput) {
    setFormError(null)
    setVerifyEmailHref(null)
    const result = await signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: buildAuthCallback(redirectPath),
    })

    if (result.error) {
      const feedback = resolveSignInFeedback(
        {
          code: result.error.code,
          message: result.error.message,
        },
        values.email
      )
      setFormError(feedback.message)
      setVerifyEmailHref(feedback.verifyEmailHref ?? null)
      return
    }

    navigate(redirectPath, { replace: true })
  }

  const emailError = form.formState.errors.email
  const passwordError = form.formState.errors.password
  const isSubmitting = form.formState.isSubmitting

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Use Google or your email and password. Email accounts must be verified
          before the first sign-in.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <GoogleSignInButton callbackPath={redirectPath} />
        <AuthDivider />
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field data-invalid={emailError ? true : undefined}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                aria-invalid={Boolean(emailError)}
                autoComplete="email"
                id="email"
                type="email"
                {...form.register("email")}
              />
              <FieldError errors={[emailError]} />
            </Field>
            <Field data-invalid={passwordError ? true : undefined}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                aria-invalid={Boolean(passwordError)}
                autoComplete="current-password"
                id="password"
                type="password"
                {...form.register("password")}
              />
              <FieldError errors={[passwordError]} />
            </Field>
          </FieldGroup>
          {formError ? (
            <p className="text-sm text-destructive">{formError}</p>
          ) : null}
          {verifyEmailHref ? (
            <Link className="text-sm underline" to={verifyEmailHref}>
              Resend or open verification instructions
            </Link>
          ) : null}
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm">
        <Link className="underline" to={routes.forgotPassword}>
          Forgot password?
        </Link>
        <p>
          No account?{" "}
          <Link className="underline" to={routes.signUp}>
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
