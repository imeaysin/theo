import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@workspace/contracts"
import { AuthPageBody, AuthPageHeader } from "@workspace/ui/auth"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { toastManager } from "@workspace/ui/components/toast"
import { useResetPasswordMutation } from "@/features/auth/hooks/use-auth-mutations"
import { paths } from "@/config/paths"

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const resetPassword = useResetPasswordMutation()
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  async function onSubmit(values: ResetPasswordInput) {
    if (!token) {
      toastManager.add({
        title: "Invalid link",
        description: "This reset link is missing or expired.",
        type: "error",
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
      navigate(paths.auth.signIn)
    } catch {
      toastManager.add({
        title: "Reset failed",
        description: "Could not reset your password. Request a new link.",
        type: "error",
      })
    }
  }

  return (
    <AuthPageBody
      footer={
        <Link
          className="font-sans text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
          to={paths.auth.signIn}
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
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Field>
          <FieldLabel>New password</FieldLabel>
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
