import { Navigate, useParams } from "react-router-dom"
import { ShellMain } from "@workspace/ui/components/shell"
import { Organization, type OrganizationTabView } from "@workspace/ui/auth"
import { routes } from "@/config/routes"

function isOrganizationTabView(
  value: string | undefined
): value is OrganizationTabView {
  return value === "settings" || value === "people"
}

export function OrganizationPage() {
  const { section } = useParams<{ section?: string }>()

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
        <Organization view={section} />
      </div>
    </ShellMain>
  )
}
