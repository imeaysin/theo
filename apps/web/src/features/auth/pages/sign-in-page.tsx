import { zodResolver } from "@hookform/resolvers/zod"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { useForm, useFormState } from "react-hook-form"
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
  const { errors } = useFormState({ control: form.control })

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
        <Field invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
          <Input
            autoComplete="email"
            id="sign-in-email"
            placeholder="you@example.com"
            type="email"
            {...form.register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>
        <Field invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
          <FieldControl
            {...form.register("password")}
            render={(controlProps) => (
              <PasswordInput
                {...controlProps}
                autoComplete="current-password"
                id="sign-in-password"
                placeholder="Enter your password"
              />
            )}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </Field>
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
