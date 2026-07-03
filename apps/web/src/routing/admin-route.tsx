import { Navigate, Outlet } from "react-router-dom"
import { PageLoading } from "@workspace/ui/components/page-loading"
import { usePlatformPermission } from "@workspace/auth/react"
import { platformUiPermissions } from "@workspace/ui/auth"
import { routes } from "@/config/routes"

export function AdminRoute() {
  const { data: permission, isPending } = usePlatformPermission(
    platformUiPermissions.listUsers
  )

  if (isPending) {
    return <PageLoading />
  }

  if (!permission?.success) {
    return <Navigate replace to={routes.dashboard} />
  }

  return <Outlet />
}
