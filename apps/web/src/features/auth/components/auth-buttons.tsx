import {
  useSignInSocial,
  useAuthUiConfig,
  type SocialSignInInput,
} from "@workspace/auth/react"
import {
  AuthProviderButtons,
  type AuthOAuthProvider,
} from "@workspace/ui-shadcn/auth"
import { absoluteAppUrl, defaultAuthenticatedRoute } from "@/config/routes"

type AuthButtonsProps = {
  callbackPath?: string
}

export function AuthButtons({
  callbackPath = defaultAuthenticatedRoute,
}: AuthButtonsProps) {
  const { socialProviders } = useAuthUiConfig()
  const socialSignIn = useSignInSocial()

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
      providers={socialProviders}
      showDivider
    />
  )
}
