import { AuthOAuthButton } from "@workspace/ui/auth"
import { useSocialSignInMutation } from "@/features/auth/hooks/use-auth-mutations"

const providers = [
  { id: "google" as const, label: "Google", primary: true },
  { id: "github" as const, label: "GitHub", primary: false },
]

export function AuthButtons() {
  const socialSignIn = useSocialSignInMutation()

  return (
    <div className="flex flex-col gap-3">
      {providers.map((provider) => (
        <AuthOAuthButton
          key={provider.id}
          loading={
            socialSignIn.isPending && socialSignIn.variables === provider.id
          }
          onClick={() => socialSignIn.mutate(provider.id)}
          primary={provider.primary}
          provider={provider.id}
        />
      ))}
    </div>
  )
}
