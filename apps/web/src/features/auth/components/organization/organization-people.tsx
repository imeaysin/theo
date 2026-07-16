"use client"

import type { ComponentProps } from "react"

import { cn } from "@workspace/ui-shadcn/lib/utils"
import { OrganizationInvitations } from "@/features/auth/components/organization/organization-invitations"
import { OrganizationMembers } from "@/features/auth/components/organization/organization-members"

/** Props for the `OrganizationPeople` component. */
export type OrganizationPeopleProps = {
  className?: string
}

/**
 * Organization people UI: members table, then org invitations.
 */
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
