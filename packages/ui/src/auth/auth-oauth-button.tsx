"use client"

import type { ReactNode } from "react"
import { Badge } from "@workspace/ui/components/badge"
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

export interface AuthOAuthButtonProps {
  provider: AuthOAuthProvider
  onClick: () => void
  loading?: boolean
  primary?: boolean
  showLastUsed?: boolean
  className?: string
}

export function AuthOAuthButton({
  provider,
  onClick,
  loading = false,
  primary = false,
  showLastUsed = false,
  className,
}: AuthOAuthButtonProps) {
  const config = providerConfig[provider]
  const Icon = config.icon

  return (
    <div className={cn("relative w-full", className)}>
      <Button
        className="w-full"
        loading={loading}
        onClick={onClick}
        size="lg"
        type="button"
        variant={primary ? "default" : "outline"}
      >
        <Icon aria-hidden="true" />
        Continue with {config.label}
      </Button>
      {showLastUsed && !loading ? (
        <Badge
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
          size="sm"
          variant="secondary"
        >
          Last used
        </Badge>
      ) : null}
    </div>
  )
}
