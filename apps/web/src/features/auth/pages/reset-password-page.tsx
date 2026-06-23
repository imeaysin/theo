import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthResetPassword } from "@/features/auth/hooks/use-auth-mutations"
import { ResetPasswordForm } from "@workspace/ui/components/auth/reset-password-form"
import { paths } from "@/config/paths"

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [isSuccess, setIsSuccess] = useState(false)
  const { mutateAsync: resetPassword, isPending, error } = useAuthResetPassword()

  return (
    <ResetPasswordForm
      onSubmit={async (values) => {
        // In Better Auth, the token is typically automatically extracted from the URL if not provided.
        await resetPassword({
          newPassword: values.password,
        })
        setIsSuccess(true)
        setTimeout(() => {
          navigate(paths.auth.signIn)
        }, 2000)
      }}
      isPending={isPending}
      error={error?.message}
      successMessage={
        isSuccess
          ? "Your password has been successfully reset. Redirecting to sign in..."
          : undefined
      }
      signInHref={paths.auth.signIn}
    />
  )
}
