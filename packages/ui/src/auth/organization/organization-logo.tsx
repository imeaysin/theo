"use client"

import type { OrganizationSummary } from "@workspace/auth/types/organization"
import { Briefcase } from "lucide-react"
import type { ReactNode } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

export type OrganizationLogoSize = "sm" | "md" | "lg"

export interface OrganizationLogoProps {
  className?: string
  fallback?: ReactNode
  loading?: boolean
  organization?: OrganizationSummary | null
  size?: OrganizationLogoSize
}

const sizeClasses: Record<OrganizationLogoSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
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

  const initials = organization?.name?.slice(0, 2).toUpperCase()
  const logo = organization?.logo?.trim() || undefined

  return (
    <Avatar className={cn("rounded-full", sizeClasses[size], className)}>
      <AvatarImage alt={organization?.name ?? "Organization"} src={logo} />
      <AvatarFallback className="text-muted-foreground">
        {fallback ?? initials ?? (
          <Briefcase aria-hidden="true" className="size-4" />
        )}
      </AvatarFallback>
    </Avatar>
  )
}
