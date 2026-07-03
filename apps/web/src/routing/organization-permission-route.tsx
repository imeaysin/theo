import { Navigate, Outlet, useOutletContext } from "react-router-dom"
import type { OrganizationPermissionCheck } from "@workspace/auth/permissions/organization"
import { useOrganizationPermission } from "@workspace/auth/react"
import { PageLoading } from "@workspace/ui/components/page-loading"
import { routes } from "@/config/routes"

type OrganizationPermissionRouteProps = {
  permission: OrganizationPermissionCheck
}

export function OrganizationPermissionRoute({
  permission,
}: OrganizationPermissionRouteProps) {
  const { data: result, isPending } = useOrganizationPermission(permission)
  const parentContext = useOutletContext()

  if (isPending) {
    return <PageLoading />
  }

  if (!result?.success) {
    return <Navigate replace to={routes.organizationSettings} />
  }

  return <Outlet context={parentContext} />
}
