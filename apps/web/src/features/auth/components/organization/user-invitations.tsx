"use client"

import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useListUserInvitations,
} from "@better-auth-ui/react"

import { Card, CardContent } from "@workspace/ui-shadcn/components/card"
import { Separator } from "@workspace/ui-shadcn/components/separator"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { UserInvitationRow } from "@/features/auth/components/organization/user-invitation-row"
import { UserInvitationRowSkeleton } from "@/features/auth/components/organization/user-invitation-row-skeleton"
import { UserInvitationsEmpty } from "@/features/auth/components/organization/user-invitations-empty"

export type UserInvitationsProps = {
  className?: string
}

/**
 * Organization invitations for the signed-in user. Always renders the section
 * card; uses `UserInvitationsEmpty` when there are no pending invitations.
 */
export function UserInvitations({ className }: UserInvitationsProps) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { data: invitations, isPending } = useListUserInvitations(
    authClient as OrganizationAuthClient
  )

  function renderCardContent() {
    if (isPending) {
      return (
        <div className="p-4">
          <UserInvitationRowSkeleton />
        </div>
      )
    }

    if (!invitations?.length) {
      return <UserInvitationsEmpty />
    }

    return invitations.map((invitation, index) => (
      <div key={invitation.id}>
        {index > 0 && <Separator />}

        <div className="p-4">
          <UserInvitationRow invitation={invitation} />
        </div>
      </div>
    ))
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-3">
        <h2 className="truncate text-sm font-semibold">
          {organizationLocalization.invitations}
        </h2>

        <Card className="p-0">
          <CardContent className="p-0">{renderCardContent()}</CardContent>
        </Card>
      </div>
    </div>
  )
}
