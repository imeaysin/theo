import { useActiveOrganization } from "@workspace/auth/react"
import { Organization } from "@workspace/ui-shadcn/auth"
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
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">
          Workspace Settings
        </h2>
        <p className="text-muted-foreground">
          Manage your workspace name, slug, and general settings.
        </p>
      </div>
      <Organization
        onCreateOrganization={openCreateOrganization}
        settings={activeOrganization ? { profile } : undefined}
        view="settings"
      />
    </div>
  )
}
