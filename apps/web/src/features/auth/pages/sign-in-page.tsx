import { useNavigate } from "react-router-dom"
import { useAuthSignIn } from "@/features/auth/hooks/use-auth-mutations"
import { SignInForm } from "@workspace/ui/components/auth/sign-in-form"
import { paths } from "@/config/paths"
import { authClient } from "@/lib/auth"

export function SignInPage() {
  const navigate = useNavigate()
  const { mutateAsync: signIn, isPending, error } = useAuthSignIn()

  return (
    <SignInForm
      onSubmit={async (values) => {
        await signIn({
          email: values.email,
          password: values.password,
        })
        navigate(paths.dashboard)
      }}
      onSocialSignIn={async (provider) => {
        await authClient.signIn.social({
          provider,
          callbackURL: window.location.origin + paths.dashboard,
        })
      }}
      isPending={isPending}
      error={error?.message}
      forgotPasswordHref={paths.auth.forgotPassword}
      signUpHref={paths.auth.signUp}
    />
  )
}
