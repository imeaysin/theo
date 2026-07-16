import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { Organization } from "@/features/auth/components/organization/organization"
import { Navigate, useParams } from "react-router-dom"

const validOrganizationPaths = new Set(
  Object.values(organizationPlugin().viewPaths.organization)
)

export function OrganizationPage() {
  const { path } = useParams<{ path: string }>()

  if (!path || !validOrganizationPaths.has(path)) {
    return <Navigate replace to="settings" />
  }

  return <Organization path={path} />
}
