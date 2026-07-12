import type { ComponentType } from "react"
import { Plug } from "lucide-react"
import { Icons } from "../components/icons"

export const providerIcons: Record<
  string,
  ComponentType<{ className?: string }>
> = {
  google: Icons.Google,
  github: Icons.Github,
}

export function getProviderName(provider: string): string {
  if (provider === "google") return "Google"
  if (provider === "github") return "GitHub"
  return provider.charAt(0).toUpperCase() + provider.slice(1)
}

export const DefaultProviderIcon = Plug
