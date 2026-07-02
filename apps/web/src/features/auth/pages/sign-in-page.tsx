import { zodResolver } from "@hookform/resolvers/zod"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import { signInSchema, type SignInInput } from "@workspace/contracts"
import { AuthDivider, AuthPageBody, AuthPageHeader } from "@workspace/ui/auth"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { PasswordInput } from "@workspace/ui/components/password-input"
import { PageLoading } from "@workspace/ui/components/page-loading"
import { AuthButtons } from "@/features/auth/components/auth-buttons"
import { useSignInEmail, useAuthSession } from "@workspace/auth/react"
import { defaultAuthenticatedRoute, routes } from "@/config/routes"
import { site } from "@/config/site"
import {
  getSafeRedirectPath,
  withAuthRedirectQuery,
} from "@/routing/safe-redirect"

function getSignInErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code: string }).code)
    if (code === "EMAIL_NOT_VERIFIED") {
      return "Verify your email before signing in."
    }
  }
  return "Check your email and password, then try again."
}

export function SignInPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = getSafeRedirectPath(
    searchParams.get("redirect"),
    defaultAuthenticatedRoute
  )
  const { data: session, isPending } = useAuthSession()
  const signIn = useSignInEmail()
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })

  if (isPending) {
    return <PageLoading />
  }

  if (session) {
    return <Navigate replace to={redirectPath} />
  }

  async function onSubmit(values: SignInInput) {
    try {
      const data = await signIn.mutateAsync(values)
      if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
        navigate(
          withAuthRedirectQuery(routes.twoFactor, {
            redirect: searchParams.get("redirect"),
            fallback: defaultAuthenticatedRoute,
          })
        )
        return
      }
      navigate(redirectPath)
    } catch (error) {
      const message = getSignInErrorMessage(error)
      if (message.includes("Verify your email")) {
        form.setError("email", { message })
        navigate(
          `${routes.verifyEmail}?email=${encodeURIComponent(values.email)}`
        )
        return
      }
      form.setError("password", { message })
    }
  }

  return (
    <AuthPageBody
      footer={
        <p className="font-sans text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            className="text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80"
            to={withAuthRedirectQuery(routes.signUp, {
              redirect: searchParams.get("redirect"),
              fallback: defaultAuthenticatedRoute,
            })}
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

      <AuthButtons callbackPath={redirectPath} />

      <AuthDivider />

      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState: { invalid, error } }) => (
            <Field invalid={invalid}>
              <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
              <Input
                {...field}
                autoComplete="email"
                id="sign-in-email"
                placeholder="you@example.com"
                type="email"
              />
              <FieldError match={Boolean(error)}>{error?.message}</FieldError>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState: { invalid, error } }) => (
            <Field invalid={invalid}>
              <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
              <FieldControl
                {...field}
                render={(controlProps) => (
                  <PasswordInput
                    {...controlProps}
                    autoComplete="current-password"
                    id="sign-in-password"
                    placeholder="Enter your password"
                  />
                )}
              />
              <FieldError match={Boolean(error)}>{error?.message}</FieldError>
            </Field>
          )}
        />
        <div className="flex justify-end">
          <Link
            className="font-sans text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
            to={routes.forgotPassword}
          >
            Forgot password?
          </Link>
        </div>
        <Button
          className="w-full"
          loading={signIn.isPending}
          size="lg"
          type="submit"
          variant="default"
        >
          Sign in
        </Button>
      </form>
    </AuthPageBody>
  )
}
