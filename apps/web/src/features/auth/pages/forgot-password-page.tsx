import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { useForm, useFormState } from "react-hook-form"
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@workspace/contracts"
import { AuthPageBody, AuthPageHeader } from "@workspace/ui/auth"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { toastManager } from "@workspace/ui/components/toast"
import { useRequestPasswordReset } from "@workspace/auth/react"
import { absoluteAppUrl, routes } from "@/config/routes"

export function ForgotPasswordPage() {
  const forgotPassword = useRequestPasswordReset()
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })
  const { errors } = useFormState({ control: form.control })

  async function onSubmit(values: ForgotPasswordInput) {
    try {
      await forgotPassword.mutateAsync({
        email: values.email,
        redirectTo: absoluteAppUrl(routes.resetPassword),
      })
      toastManager.add({
        title: "Check your email",
        description: "If an account exists, a reset link has been sent.",
        type: "success",
      })
    } catch {
      form.setError("email", {
        message: "Could not send a reset link. Please try again.",
      })
    }
  }

  return (
    <AuthPageBody
      footer={
        <Link
          className="font-sans text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
          to={routes.signIn}
        >
          Back to sign in
        </Link>
      }
    >
      <AuthPageHeader
        description="Enter your email and we'll send you a reset link."
        title="Forgot password"
      />

      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="forgot-password-email">Email</FieldLabel>
          <Input
            autoComplete="email"
            id="forgot-password-email"
            placeholder="you@example.com"
            type="email"
            {...form.register("email")}
            aria-invalid={!!errors.email}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>
        <Button
          className="w-full"
          loading={forgotPassword.isPending}
          size="lg"
          type="submit"
          variant="default"
        >
          Send reset link
        </Button>
      </form>
    </AuthPageBody>
  )
}
