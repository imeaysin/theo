"use client"

import { cn } from "@workspace/ui/lib/utils"
import { OrganizationInvitations } from "./organization-invitations"
import { OrganizationMembers } from "./organization-members"

export interface OrganizationPeopleProps {
  className?: string
}

export function OrganizationPeople({ className }: OrganizationPeopleProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:gap-6", className)}>
      <OrganizationMembers />
      <OrganizationInvitations />
    </div>
  )
}
