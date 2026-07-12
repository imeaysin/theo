"use client"

import type { OrganizationSummary } from "@workspace/auth/types/organization"
import { Briefcase } from "lucide-react"
import type { ReactNode } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui-shadcn/components/avatar"
import { Skeleton } from "@workspace/ui-shadcn/components/skeleton"
import { cn } from "@workspace/ui-shadcn/lib/utils"

export type OrganizationLogoSize = "xs" | "sm" | "md" | "lg"

export type OrganizationLogoProps = {
  className?: string
  fallback?: ReactNode
  loading?: boolean
  organization?: OrganizationSummary | null
  size?: OrganizationLogoSize
}

const sizeClasses: Record<OrganizationLogoSize, string> = {
  xs: "size-4",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
}

const fallbackIconClasses: Record<OrganizationLogoSize, string> = {
  xs: "size-2.5",
  sm: "size-4",
  md: "size-4",
  lg: "size-5",
}

export function OrganizationLogo({
  className,
  fallback,
  loading = false,
  organization,
  size = "sm",
}: OrganizationLogoProps) {
  if (loading && !organization) {
    return (
      <Skeleton className={cn("rounded-full", sizeClasses[size], className)} />
    )
  }

  const name = organization?.name?.trim() || ""
  const words = name.split(/\s+/)
  const initials =
    words.length > 1 && words[0] && words[1]
      ? (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
      : name.charAt(0).toUpperCase()

  const logo = organization?.logo?.trim() || undefined

  return (
    <Avatar className={cn("rounded-full", sizeClasses[size], className)}>
      <AvatarImage alt={organization?.name ?? "Organization"} src={logo} />
      <AvatarFallback className="bg-muted text-xs text-muted-foreground">
        {fallback ?? initials ?? (
          <Briefcase aria-hidden="true" className={fallbackIconClasses[size]} />
        )}
      </AvatarFallback>
    </Avatar>
  )
}
