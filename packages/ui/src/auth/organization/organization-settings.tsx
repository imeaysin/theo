"use client"

import type { ComponentProps } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { OrganizationDangerZone } from "./organization-danger-zone"
import { OrganizationProfile } from "./organization-profile"

export interface OrganizationSettingsProps {
  className?: string
}

export function OrganizationSettings({
  className,
  ...props
}: OrganizationSettingsProps & ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-4 md:gap-6", className)} {...props}>
      <OrganizationProfile />
      <OrganizationDangerZone />
    </div>
  )
}
