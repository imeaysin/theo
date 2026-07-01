"use client"

import { cn } from "@workspace/ui/lib/utils"
import { OrganizationDangerZone } from "./organization-danger-zone"
import {
  OrganizationProfile,
  type OrganizationProfileProps,
} from "./organization-profile"

export interface OrganizationSettingsProps {
  className?: string
  profile?: OrganizationProfileProps
}

export function OrganizationSettings({
  className,
  profile,
}: OrganizationSettingsProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <OrganizationProfile {...profile} />
      <OrganizationDangerZone />
    </div>
  )
}
