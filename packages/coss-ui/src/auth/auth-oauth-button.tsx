"use client"

import type { ReactNode } from "react"
import { Icons } from "@workspace/ui/components/icons"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export type AuthOAuthProvider = "google" | "github"

const providerConfig: Record<
  AuthOAuthProvider,
  { label: string; icon: (props: { className?: string }) => ReactNode }
> = {
  google: {
    label: "Google",
    icon: Icons.Google,
  },
  github: {
    label: "GitHub",
    icon: Icons.Github,
  },
}

export type AuthOAuthButtonProps = {
  provider: AuthOAuthProvider
  onClick: () => void
  loading?: boolean
  primary?: boolean
  className?: string
}

export function AuthOAuthButton({
  provider,
  onClick,
  loading = false,
  primary = false,
  className,
}: AuthOAuthButtonProps) {
  const config = providerConfig[provider]
  const Icon = config.icon

  return (
    <Button
      className={cn("w-full", className)}
      loading={loading}
      onClick={onClick}
      size="lg"
      type="button"
      variant={primary ? "default" : "outline"}
    >
      <Icon aria-hidden="true" />
      Continue with {config.label}
    </Button>
  )
}
