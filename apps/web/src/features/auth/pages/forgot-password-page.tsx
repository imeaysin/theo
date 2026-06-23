import { useState } from "react"
import { useAuthRequestPasswordReset } from "@/features/auth/hooks/use-auth-mutations"
import { ForgotPasswordForm } from "@workspace/ui/components/auth/forgot-password-form"
import { paths } from "@/config/paths"

export function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const { mutateAsync: requestReset, isPending, error } = useAuthRequestPasswordReset()

  return (
    <ForgotPasswordForm
      onSubmit={async (values) => {
        await requestReset({
          email: values.email,
        })
        setIsSuccess(true)
      }}
      isPending={isPending}
      error={error?.message}
      successMessage={
        isSuccess
          ? "Check your email for a password reset link. If it doesn't appear within a few minutes, check your spam folder."
          : undefined
      }
      signInHref={paths.auth.signIn}
    />
  )
}
