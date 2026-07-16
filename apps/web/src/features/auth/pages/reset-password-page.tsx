import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@workspace/auth/client"
import {
  ResetPasswordSchema,
  type ResetPasswordInput,
} from "@workspace/contracts"
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
import { routes } from "@/config/routes"

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [formError, setFormError] = useState<string | null>(null)
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid reset link</CardTitle>
          <CardDescription>
            Request a new password reset email to continue.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link className="text-sm underline" to={routes.forgotPassword}>
            Forgot password
          </Link>
        </CardFooter>
      </Card>
    )
  }

  const resetToken = token

  async function onSubmit(values: ResetPasswordInput) {
    setFormError(null)
    const result = await authClient.resetPassword({
      newPassword: values.password,
      token: resetToken,
    })

    if (result.error) {
      setFormError(result.error.message ?? "Unable to reset password")
      return
    }

    navigate(routes.signIn, { replace: true })
  }

  const errors = form.formState.errors
  const isSubmitting = form.formState.isSubmitting

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>
          Choose a new password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field data-invalid={errors.password ? true : undefined}>
              <FieldLabel htmlFor="password">New password</FieldLabel>
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
            Update password
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
