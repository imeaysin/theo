"use client"

import type { ComponentProps } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { OrganizationInvitations } from "./organization-invitations"
import { OrganizationMembers } from "./organization-members"

export interface OrganizationPeopleProps {
  className?: string
}

export function OrganizationPeople({
  className,
  ...props
}: OrganizationPeopleProps & ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-4 md:gap-6", className)} {...props}>
      <OrganizationMembers />
      <OrganizationInvitations />
    </div>
  )
}
