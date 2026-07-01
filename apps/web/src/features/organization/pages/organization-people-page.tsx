"use client"

import { Navigate } from "react-router-dom"
import { useActiveOrganization } from "@workspace/auth/react"
import { Organization } from "@workspace/ui/auth"
import { ShellMain } from "@workspace/ui/components/shell"
import { routes } from "@/config/routes"
import { useInviteMemberDialog } from "@/features/auth/hooks/use-invite-member-dialog"

export function OrganizationPeoplePage() {
  const { data: activeOrganization, isPending } = useActiveOrganization()
  const inviteMember = useInviteMemberDialog()

  if (!isPending && !activeOrganization) {
    return <Navigate replace to={routes.dashboard} />
  }

  return (
    <ShellMain
      heading="Workspace"
      subtitle="Manage your workspace settings and members."
    >
      <Organization
        people={{
          members: {
            inviteDialog: inviteMember.dialogProps,
            onInviteClick: inviteMember.openDialog,
          },
        }}
        view="people"
      />
    </ShellMain>
  )
}
