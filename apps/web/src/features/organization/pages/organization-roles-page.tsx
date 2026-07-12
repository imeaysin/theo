import { useActiveOrganization } from "@workspace/auth/react"
import { Organization } from "@workspace/ui-shadcn/auth"
import { useAppOutletContext } from "@/features/auth/app-outlet-context"
import { useOrganizationRoleDialogs } from "@/features/auth/hooks/use-organization-role-dialogs"

export function OrganizationRolesPage() {
  const { data: activeOrganization } = useActiveOrganization()
  const { openCreateOrganization } = useAppOutletContext()
  const roleDialogs = useOrganizationRoleDialogs()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Roles</h2>
        <p className="text-muted-foreground">
          Manage built-in and custom roles for your workspace.
        </p>
      </div>
      <Organization
        onCreateOrganization={openCreateOrganization}
        roles={activeOrganization ? { ...roleDialogs.rolesProps } : undefined}
        view="roles"
      />
    </div>
  )
}
