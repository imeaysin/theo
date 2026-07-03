import { useActiveOrganization } from "@workspace/auth/react"
import { Organization } from "@workspace/ui/auth"
import { ShellMain } from "@workspace/ui/components/shell"
import { useAppOutletContext } from "@/features/auth/app-outlet-context"
import { useOrganizationProfileForm } from "@/features/auth/hooks/use-organization-profile-form"

const emptyOrganization = {
  id: "",
  name: "",
  slug: "",
  createdAt: new Date(),
}

export function OrganizationSettingsPage() {
  const { data: activeOrganization } = useActiveOrganization()
  const { openCreateOrganization } = useAppOutletContext()
  const organization = activeOrganization ?? emptyOrganization
  const profile = useOrganizationProfileForm(organization)

  return (
    <ShellMain
      header={{
        heading: "Workspace",
        subtitle: "Manage your workspace settings and members.",
      }}
    >
      <Organization
        onCreateOrganization={openCreateOrganization}
        settings={activeOrganization ? { profile } : undefined}
        view="settings"
      />
    </ShellMain>
  )
}
