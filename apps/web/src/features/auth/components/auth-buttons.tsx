import {
  useSocialSignInMutation,
  type SocialSignInInput,
} from "@workspace/auth/react"
import { AuthProviderButtons, type AuthOAuthProvider } from "@workspace/ui/auth"
import { absoluteAppUrl, defaultAuthenticatedRoute } from "@/config/routes"

const providers: AuthOAuthProvider[] = ["google", "github"]

interface AuthButtonsProps {
  callbackPath?: string
}

export function AuthButtons({
  callbackPath = defaultAuthenticatedRoute,
}: AuthButtonsProps) {
  const socialSignIn = useSocialSignInMutation()

  function handleProviderClick(provider: AuthOAuthProvider) {
    const input: SocialSignInInput = {
      provider,
      callbackURL: absoluteAppUrl(callbackPath),
    }
    socialSignIn.mutate(input)
  }

  return (
    <AuthProviderButtons
      loadingProvider={
        socialSignIn.isPending
          ? (socialSignIn.variables?.provider ?? null)
          : null
      }
      onProviderClick={handleProviderClick}
      providers={providers}
      showDivider
    />
  )
}
