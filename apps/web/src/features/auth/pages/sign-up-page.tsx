import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUp } from "@workspace/auth/client"
import { SignUpSchema, type SignUpInput } from "@workspace/contracts"
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
import { AuthDivider } from "@/features/auth/components/auth-divider"
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button"
import { buildAuthCallback } from "@/features/auth/lib/auth-callback"

export function SignUpPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const form = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: SignUpInput) {
    setFormError(null)
    const result = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: buildAuthCallback(routes.verifyEmail),
    })

    if (result.error) {
      setFormError(result.error.message ?? "Unable to create account")
      return
    }

    navigate(
      `${routes.verifyEmail}?email=${encodeURIComponent(values.email)}`,
      { replace: true }
    )
  }

  const errors = form.formState.errors
  const isSubmitting = form.formState.isSubmitting

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Sign up with Google or email. Email sign-ups require verification
          before you can sign in.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <GoogleSignInButton
          callbackPath={defaultAuthenticatedRoute}
          label="Continue with Google"
        />
        <AuthDivider />
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field data-invalid={errors.name ? true : undefined}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                aria-invalid={Boolean(errors.name)}
                autoComplete="name"
                id="name"
                {...form.register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field data-invalid={errors.email ? true : undefined}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                id="email"
                type="email"
                {...form.register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field data-invalid={errors.password ? true : undefined}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                aria-invalid={Boolean(errors.password)}
                autoComplete="new-password"
                id="password"
                type="password"
                {...form.register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>
            <Field data-invalid={errors.confirmPassword ? true : undefined}>
              <FieldLabel htmlFor="confirmPassword">
                Confirm password
              </FieldLabel>
              <Input
                aria-invalid={Boolean(errors.confirmPassword)}
                autoComplete="new-password"
                id="confirmPassword"
                type="password"
                {...form.register("confirmPassword")}
              />
              <FieldError errors={[errors.confirmPassword]} />
            </Field>
          </FieldGroup>
          {formError ? (
            <p className="text-sm text-destructive">{formError}</p>
          ) : null}
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            {isSubmitting ? "Creating…" : "Sign up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm">
        Already have an account?{" "}
        <Link className="ml-1 underline" to={routes.signIn}>
          Sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
