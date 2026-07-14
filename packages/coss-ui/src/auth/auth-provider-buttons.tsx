"use client"

import { AuthDivider } from "./auth-divider"
import { AuthOAuthButton, type AuthOAuthProvider } from "./auth-oauth-button"
import { cn } from "@workspace/ui/lib/utils"

export type AuthProviderButtonsProps = {
  providers: AuthOAuthProvider[]
  onProviderClick: (provider: AuthOAuthProvider) => void
  loadingProvider?: AuthOAuthProvider | null
  showDivider?: boolean
  className?: string
}

const providerMeta: Record<AuthOAuthProvider, { primary: boolean }> = {
  google: { primary: true },
  github: { primary: false },
}

export function AuthProviderButtons({
  providers,
  onProviderClick,
  loadingProvider = null,
  showDivider = true,
  className,
}: AuthProviderButtonsProps) {
  if (!providers.length) return null

  return (
    <>
      <div className={cn("flex flex-col gap-3", className)}>
        {providers.map((provider) => (
          <AuthOAuthButton
            key={provider}
            loading={loadingProvider === provider}
            onClick={() => onProviderClick(provider)}
            primary={providerMeta[provider].primary}
            provider={provider}
          />
        ))}
      </div>
      {showDivider ? <AuthDivider /> : null}
    </>
  )
}
