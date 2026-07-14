"use client"

import { cn } from "@workspace/ui/lib/utils"
import { OrganizationInvitations } from "./organization-invitations"
import {
  OrganizationMembers,
  type OrganizationMembersProps,
} from "./organization-members"

export type OrganizationPeopleProps = {
  className?: string
  members?: Omit<OrganizationMembersProps, "className">
}

export function OrganizationPeople({
  className,
  members,
}: OrganizationPeopleProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:gap-6", className)}>
      <OrganizationMembers {...members} />
      <OrganizationInvitations />
    </div>
  )
}
