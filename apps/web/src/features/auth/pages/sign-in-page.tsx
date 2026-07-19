import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "@workspace/auth/client"
import { SignInSchema, type SignInInput } from "@workspace/contracts"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Spinner } from "@workspace/ui/components/spinner"
import { routes, defaultAuthenticatedRoute } from "@/config/routes"
import { site } from "@/config/site"
import { AuthDivider } from "@/features/auth/components/auth-divider"
import { AuthPageBody } from "@/features/auth/components/auth-page-body"
import { AuthPageHeader } from "@/features/auth/components/auth-page-header"
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button"
import { buildAuthCallback } from "@/features/auth/lib/auth-callback"
import { resolveSignInFeedback } from "@/features/auth/lib/sign-in-feedback"
import { getSafeRedirectPath } from "@/routing/safe-redirect"

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

  function clearAuthError() {
    if (formError) setFormError(null)
    if (verifyEmailHref) setVerifyEmailHref(null)
  }

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
    <AuthPageBody
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link
            className="text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80"
            to={routes.signUp}
          >
            Sign up
          </Link>
        </p>
      }
    >
      <AuthPageHeader
        description="Sign in or create an account"
        title={`Welcome to ${site.name}`}
      />

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
              {...form.register("email", { onChange: clearAuthError })}
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
              {...form.register("password", { onChange: clearAuthError })}
            />
            <FieldError errors={[passwordError]} />
          </Field>
        </FieldGroup>

        <div className="flex justify-end">
          <Link
            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            to={routes.forgotPassword}
          >
            Forgot password?
          </Link>
        </div>

        {formError ? (
          <p className="text-sm text-destructive" role="alert">
            {formError}
            {verifyEmailHref ? (
              <>
                {" "}
                <Link
                  className="underline underline-offset-4"
                  to={verifyEmailHref}
                >
                  Resend verification
                </Link>
              </>
            ) : null}
          </p>
        ) : null}

        <Button
          className="w-full"
          disabled={isSubmitting}
          size="lg"
          type="submit"
        >
          {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthPageBody>
  )
}
