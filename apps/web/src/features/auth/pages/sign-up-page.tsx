import { useNavigate } from "react-router-dom"
import { useAuthSignUp } from "@/features/auth/hooks/use-auth-mutations"
import { SignUpForm } from "@workspace/ui/components/auth/sign-up-form"
import { paths } from "@/config/paths"
import { authClient } from "@/lib/auth"

export function SignUpPage() {
  const navigate = useNavigate()
  const { mutateAsync: signUp, isPending, error } = useAuthSignUp()

  return (
    <SignUpForm
      onSubmit={async (values) => {
        await signUp({
          email: values.email,
          password: values.password,
          name: values.name,
        })
        navigate(paths.dashboard)
      }}
      onSocialSignUp={async (provider) => {
        await authClient.signIn.social({
          provider,
          callbackURL: window.location.origin + paths.auth.oauthCallback,
        })
      }}
      isPending={isPending}
      error={error?.message}
      signInHref={paths.auth.signIn}
    />
  )
}
