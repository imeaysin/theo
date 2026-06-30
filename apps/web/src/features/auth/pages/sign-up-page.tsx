import { zodResolver } from "@hookform/resolvers/zod"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { signUpSchema, type SignUpInput } from "@workspace/contracts"
import { AuthDivider, AuthPageBody, AuthPageHeader } from "@workspace/ui/auth"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { PageLoading } from "@workspace/ui/components/page-loading"
import { toastManager } from "@workspace/ui/components/toast"
import { AuthButtons } from "@/features/auth/components/auth-buttons"
import { useSignUpMutation } from "@/features/auth/hooks/use-auth-mutations"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { paths } from "@/config/paths"
import { site } from "@/config/site"

export function SignUpPage() {
  const navigate = useNavigate()
  const { data: session, isPending } = useAuthSession()
  const signUp = useSignUpMutation()
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  if (isPending) {
    return <PageLoading />
  }

  if (session) {
    return <Navigate replace to={paths.dashboard} />
  }

  async function onSubmit(values: SignUpInput) {
    try {
      await signUp.mutateAsync(values)
      toastManager.add({
        title: "Account created",
        description: "Check your email to verify your account.",
        type: "success",
      })
      navigate(
        `${paths.auth.verifyEmail}?email=${encodeURIComponent(values.email)}`
      )
    } catch {
      toastManager.add({
        title: "Sign up failed",
        description: "Could not create your account. Please try again.",
        type: "error",
      })
    }
  }

  return (
    <AuthPageBody
      footer={
        <p className="font-sans text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            className="text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80"
            to={paths.auth.signIn}
          >
            Sign in
          </Link>
        </p>
      }
    >
      <AuthPageHeader
        description="Create your account to get started"
        title={`Join ${site.name}`}
      />

      <AuthButtons />

      <AuthDivider />

      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input
            autoComplete="name"
            type="text"
            {...form.register("name")}
            aria-invalid={!!form.formState.errors.name}
          />
          {form.formState.errors.name ? (
            <FieldError>{form.formState.errors.name.message}</FieldError>
          ) : null}
        </Field>
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
            autoComplete="new-password"
            type="password"
            {...form.register("password")}
            aria-invalid={!!form.formState.errors.password}
          />
          {form.formState.errors.password ? (
            <FieldError>{form.formState.errors.password.message}</FieldError>
          ) : null}
        </Field>
        <Field>
          <FieldLabel>Confirm password</FieldLabel>
          <Input
            autoComplete="new-password"
            type="password"
            {...form.register("confirmPassword")}
            aria-invalid={!!form.formState.errors.confirmPassword}
          />
          {form.formState.errors.confirmPassword ? (
            <FieldError>
              {form.formState.errors.confirmPassword.message}
            </FieldError>
          ) : null}
        </Field>
        <Button
          className="w-full"
          loading={signUp.isPending}
          size="lg"
          type="submit"
          variant="default"
        >
          Create account
        </Button>
      </form>
    </AuthPageBody>
  )
}
