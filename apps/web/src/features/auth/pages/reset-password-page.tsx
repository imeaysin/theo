import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useForm, useFormState } from "react-hook-form"
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@workspace/contracts"
import { AuthPageBody, AuthPageHeader } from "@workspace/ui/auth"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import { PasswordInput } from "@workspace/ui/components/password-input"
import { toastManager } from "@workspace/ui/components/toast"
import { useResetPassword } from "@workspace/auth/react"
import { routes } from "@/config/routes"

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const resetPassword = useResetPassword()
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })
  const { errors } = useFormState({ control: form.control })

  async function onSubmit(values: ResetPasswordInput) {
    if (!token) {
      form.setError("password", {
        message: "This reset link is missing or expired.",
      })
      return
    }

    try {
      await resetPassword.mutateAsync({ input: values, token })
      toastManager.add({
        title: "Password updated",
        description: "You can now sign in with your new password.",
        type: "success",
      })
      navigate(routes.signIn)
    } catch {
      form.setError("password", {
        message: "Could not reset your password. Request a new link.",
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
        description="Choose a new password for your account."
        title="Reset password"
      />

      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Field invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor="reset-password">New password</FieldLabel>
          <FieldControl
            {...form.register("password")}
            render={(controlProps) => (
              <PasswordInput
                {...controlProps}
                autoComplete="new-password"
                id="reset-password"
                placeholder="Enter a new password"
              />
            )}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </Field>
        <Field invalid={Boolean(errors.confirmPassword)}>
          <FieldLabel htmlFor="reset-password-confirm">
            Confirm password
          </FieldLabel>
          <FieldControl
            {...form.register("confirmPassword")}
            render={(controlProps) => (
              <PasswordInput
                {...controlProps}
                autoComplete="new-password"
                id="reset-password-confirm"
                placeholder="Confirm your password"
              />
            )}
          />
          <FieldError>{errors.confirmPassword?.message}</FieldError>
        </Field>
        <Button
          className="w-full"
          loading={resetPassword.isPending}
          size="lg"
          type="submit"
          variant="default"
        >
          Update password
        </Button>
      </form>
    </AuthPageBody>
  )
}
