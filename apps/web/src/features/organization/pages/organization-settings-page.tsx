"use client"

import { Navigate } from "react-router-dom"
import { useActiveOrganization } from "@workspace/auth/react"
import { Organization } from "@workspace/ui/auth"
import { ShellMain } from "@workspace/ui/components/shell"
import { routes } from "@/config/routes"
import { useOrganizationProfileForm } from "@/features/auth/hooks/use-organization-profile-form"

const emptyOrganization = {
  id: "",
  name: "",
  slug: "",
  createdAt: new Date(),
}

export function OrganizationSettingsPage() {
  const { data: activeOrganization, isPending } = useActiveOrganization()
  const organization = activeOrganization ?? emptyOrganization
  const profile = useOrganizationProfileForm(organization)

  if (!isPending && !activeOrganization) {
    return <Navigate replace to={routes.dashboard} />
  }

  return (
    <ShellMain
      heading="Workspace"
      subtitle="Manage your workspace settings and members."
    >
      <Organization settings={{ profile }} view="settings" />
    </ShellMain>
  )
}
