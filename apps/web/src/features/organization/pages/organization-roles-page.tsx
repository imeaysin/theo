import { useActiveOrganization } from "@workspace/auth/react"
import { Organization } from "@workspace/ui/auth"
import { ShellMain } from "@workspace/ui/components/shell"
import { useAppOutletContext } from "@/features/auth/app-outlet-context"
import { useOrganizationRoleDialogs } from "@/features/auth/hooks/use-organization-role-dialogs"

export function OrganizationRolesPage() {
  const { data: activeOrganization } = useActiveOrganization()
  const { openCreateOrganization } = useAppOutletContext()
  const roleDialogs = useOrganizationRoleDialogs()

  return (
    <ShellMain
      header={{
        heading: "Workspace",
        subtitle: "Manage built-in and custom roles for your workspace.",
      }}
    >
      <Organization
        onCreateOrganization={openCreateOrganization}
        roles={
          activeOrganization
            ? {
                ...roleDialogs.rolesProps,
              }
            : undefined
        }
        view="roles"
      />
    </ShellMain>
  )
}
