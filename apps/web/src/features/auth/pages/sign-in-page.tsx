import { zodResolver } from "@hookform/resolvers/zod"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { signInSchema, type SignInInput } from "@workspace/contracts"
import { AuthDivider, AuthPageBody, AuthPageHeader } from "@workspace/ui/auth"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { PageLoading } from "@workspace/ui/components/page-loading"
import { toastManager } from "@workspace/ui/components/toast"
import { AuthButtons } from "@/features/auth/components/auth-buttons"
import { useSignInMutation } from "@/features/auth/hooks/use-auth-mutations"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { paths } from "@/config/paths"
import { site } from "@/config/site"

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
  const { data: session, isPending } = useAuthSession()
  const signIn = useSignInMutation()
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })

  if (isPending) {
    return <PageLoading />
  }

  if (session) {
    return <Navigate replace to={paths.dashboard} />
  }

  async function onSubmit(values: SignInInput) {
    try {
      const data = await signIn.mutateAsync(values)
      if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
        navigate(paths.auth.twoFactor)
        return
      }
      navigate(paths.dashboard)
    } catch (error) {
      const message = getSignInErrorMessage(error)
      toastManager.add({
        title: "Sign in failed",
        description: message,
        type: "error",
      })
      if (message.includes("Verify your email")) {
        navigate(
          `${paths.auth.verifyEmail}?email=${encodeURIComponent(values.email)}`
        )
      }
    }
  }

  return (
    <AuthPageBody
      footer={
        <p className="font-sans text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            className="text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80"
            to={paths.auth.signUp}
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

      <AuthButtons />

      <AuthDivider />

      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            autoComplete="email"
            type="email"
            {...form.register("email")}
            aria-invalid={!!form.formState.errors.email}
          />
          {form.formState.errors.email ? (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          ) : null}
        </Field>
        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            autoComplete="current-password"
            type="password"
            {...form.register("password")}
            aria-invalid={!!form.formState.errors.password}
          />
          {form.formState.errors.password ? (
            <FieldError>{form.formState.errors.password.message}</FieldError>
          ) : null}
        </Field>
        <div className="flex justify-end">
          <Link
            className="font-sans text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
            to={paths.auth.forgotPassword}
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
