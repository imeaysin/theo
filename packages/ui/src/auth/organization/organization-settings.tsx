"use client"

import { cn } from "@workspace/ui/lib/utils"
import { OrganizationDangerZone } from "./organization-danger-zone"
import { OrganizationProfile } from "./organization-profile"

export interface OrganizationSettingsProps {
  className?: string
}

export function OrganizationSettings({ className }: OrganizationSettingsProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:gap-6", className)}>
      <OrganizationProfile />
      <OrganizationDangerZone />
    </div>
  )
}
