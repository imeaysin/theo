"use client"

import type { OrganizationSummary } from "@workspace/auth/types/organization"
import type { ComponentProps } from "react"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { OrganizationLogo } from "./organization-logo"

export type OrganizationViewProps = {
  organization?: OrganizationSummary | null
  loading?: boolean
  hideSlug?: boolean
} & ComponentProps<"div">

export function OrganizationView({
  organization,
  loading = false,
  hideSlug = true,
  className,
  ...props
}: OrganizationViewProps) {
  if (loading && !organization) {
    return (
      <div
        className={cn("flex min-w-0 items-center gap-2", className)}
        {...props}
      >
        <Skeleton className="size-8 rounded-full" />
        <div className="grid min-w-0 flex-1 gap-1">
          <Skeleton className="h-4 w-24" />
          {!hideSlug ? <Skeleton className="h-3 w-20" /> : null}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn("flex min-w-0 items-center gap-2", className)}
      {...props}
    >
      <OrganizationLogo organization={organization} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm leading-tight font-medium text-foreground">
          {organization?.name ?? "Organization"}
        </p>
        {!hideSlug && organization?.slug ? (
          <p className="truncate font-mono text-xs leading-tight text-muted-foreground">
            {organization.slug}
          </p>
        ) : null}
      </div>
    </div>
  )
}
