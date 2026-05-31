import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useSearchParams } from "react-router-dom"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { FormField } from "@/components/form/form-field"
import { paths } from "@/config/paths"
import { AuthCard } from "@/features/auth/components/auth-card"
import { useResetPassword } from "@/features/auth/hooks/use-reset-password"
import { resetPasswordSchema, type ResetPasswordInput } from "@repo/contracts"

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const resetPasswordMutation = useResetPassword(token)
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  function onSubmit(values: ResetPasswordInput) {
    resetPasswordMutation.mutate(values)
  }

  if (!token) {
    return (
      <AuthCard
        title="Invalid reset link"
        description="This password reset link is missing or has expired."
        footer={
          <Link
            to={paths.auth.forgotPassword}
            className="text-foreground underline"
          >
            Request a new link
          </Link>
        }
      >
        <Alert variant="error">
          <AlertDescription>
            Open the link from your email, or request a new reset email.
          </AlertDescription>
        </Alert>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Reset password"
      description="Choose a new password for your account."
      footer={
        <Link to={paths.auth.signIn} className="text-foreground underline">
          Back to sign in
        </Link>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {resetPasswordMutation.error ? (
          <Alert variant="error">
            <AlertDescription>
              {resetPasswordMutation.error.message}
            </AlertDescription>
          </Alert>
        ) : null}

        <FormField
          control={form.control}
          name="password"
          label="New password"
          type="password"
          autoComplete="new-password"
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
        />

        <Button type="submit" disabled={resetPasswordMutation.isPending}>
          {resetPasswordMutation.isPending ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AuthCard>
  )
}
