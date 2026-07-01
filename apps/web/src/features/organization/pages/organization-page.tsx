"use client"

import { Navigate, useParams } from "react-router-dom"
import { useActiveOrganization } from "@workspace/auth/react"
import { Organization, type OrganizationTabView } from "@workspace/ui/auth"
import { ShellMain } from "@workspace/ui/components/shell"
import { routes } from "@/config/routes"
import { useInviteMemberDialog } from "@/features/auth/hooks/use-invite-member-dialog"
import { useOrganizationProfileForm } from "@/features/auth/hooks/use-organization-profile-form"

function isOrganizationTabView(
  value: string | undefined
): value is OrganizationTabView {
  return value === "settings" || value === "people"
}

const emptyOrganization = {
  id: "",
  name: "",
  slug: "",
  createdAt: new Date(),
}

export function OrganizationPage() {
  const { section } = useParams<{ section?: string }>()
  const { data: activeOrganization } = useActiveOrganization()
  const organization = activeOrganization ?? emptyOrganization
  const profile = useOrganizationProfileForm(organization)
  const inviteMember = useInviteMemberDialog()

  if (!section) {
    return <Navigate replace to={routes.organizationSettings} />
  }

  if (!isOrganizationTabView(section)) {
    return <Navigate replace to={routes.organizationSettings} />
  }

  return (
    <ShellMain
      heading="Workspace"
      subtitle="Manage your workspace settings and members."
    >
      <div className="max-w-3xl">
        <Organization
          people={{
            members: {
              inviteDialog: inviteMember.dialogProps,
              onInviteClick: inviteMember.openDialog,
            },
          }}
          settings={{ profile }}
          view={section}
        />
      </div>
    </ShellMain>
  )
}
