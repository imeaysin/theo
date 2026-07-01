import { zodResolver } from "@hookform/resolvers/zod"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { useForm, useFormState } from "react-hook-form"
import { signUpSchema, type SignUpInput } from "@workspace/contracts"
import { AuthDivider, AuthPageBody, AuthPageHeader } from "@workspace/ui/auth"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { PasswordInput } from "@workspace/ui/components/password-input"
import { PageLoading } from "@workspace/ui/components/page-loading"
import { toastManager } from "@workspace/ui/components/toast"
import { AuthButtons } from "@/features/auth/components/auth-buttons"
import { useAuthSession, useSignUpEmail } from "@workspace/auth/react"
import {
  absoluteAppUrl,
  defaultAuthenticatedRoute,
  routes,
} from "@/config/routes"
import { site } from "@/config/site"
import {
  getSafeRedirectPath,
  withAuthRedirectQuery,
} from "@/routing/safe-redirect"

export function SignUpPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = getSafeRedirectPath(
    searchParams.get("redirect"),
    defaultAuthenticatedRoute
  )
  const { data: session, isPending } = useAuthSession()
  const signUp = useSignUpEmail()
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  const { errors } = useFormState({ control: form.control })

  if (isPending) {
    return <PageLoading />
  }

  if (session) {
    return <Navigate replace to={redirectPath} />
  }

  async function onSubmit(values: SignUpInput) {
    try {
      await signUp.mutateAsync({
        ...values,
        callbackURL: absoluteAppUrl(routes.verifyEmail),
      })
      toastManager.add({
        title: "Account created",
        description: "Check your email to verify your account.",
        type: "success",
      })
      navigate(
        `${routes.verifyEmail}?email=${encodeURIComponent(values.email)}`
      )
    } catch {
      form.setError("email", {
        message: "Could not create your account. Please try again.",
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
            to={withAuthRedirectQuery(routes.signIn, {
              redirect: searchParams.get("redirect"),
              fallback: defaultAuthenticatedRoute,
            })}
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

      <AuthButtons callbackPath={redirectPath} />

      <AuthDivider />

      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="sign-up-name">Name</FieldLabel>
          <Input
            autoComplete="name"
            id="sign-up-name"
            placeholder="Your name"
            type="text"
            {...form.register("name")}
            aria-invalid={!!errors.name}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="sign-up-email">Email</FieldLabel>
          <Input
            autoComplete="email"
            id="sign-up-email"
            placeholder="you@example.com"
            type="email"
            {...form.register("email")}
            aria-invalid={!!errors.email}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="sign-up-password">Password</FieldLabel>
          <PasswordInput
            autoComplete="new-password"
            id="sign-up-password"
            placeholder="Create a password"
            {...form.register("password")}
            aria-invalid={!!errors.password}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </Field>
        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="sign-up-confirm-password">
            Confirm password
          </FieldLabel>
          <PasswordInput
            autoComplete="new-password"
            id="sign-up-confirm-password"
            placeholder="Confirm your password"
            {...form.register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
          />
          <FieldError>{errors.confirmPassword?.message}</FieldError>
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
