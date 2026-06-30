"use client"

import { useState } from "react"
import { AuthOAuthButton } from "@workspace/ui/auth"
import { authClient } from "@/lib/auth"
import { paths } from "@/config/paths"

const providers = [
  { id: "google" as const, label: "Google", primary: true },
  { id: "github" as const, label: "GitHub", primary: false },
]

export function AuthButtons() {
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null)

  async function signInWith(provider: "google" | "github") {
    setLoadingProvider(provider)
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}${paths.dashboard}`,
      })
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {providers.map((provider) => (
        <AuthOAuthButton
          key={provider.id}
          loading={loadingProvider === provider.id}
          onClick={() => void signInWith(provider.id)}
          primary={provider.primary}
          provider={provider.id}
        />
      ))}
    </div>
  )
}
