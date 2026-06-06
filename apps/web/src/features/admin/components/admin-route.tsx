import { Navigate, Outlet, useLocation } from "react-router-dom"
import { Spinner } from "@workspace/hero-ui"
import { paths } from "@/config/paths"
import { useAuthSession } from "@/features/auth/hooks"
import { useCan } from "@repo/permission-manager/react"

export function AdminRoute() {
  const location = useLocation()
  const { session, isPending } = useAuthSession()
  const canAccess = useCan({ user: ["list"] }, session?.user?.role)

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!session) {
    return (
      <Navigate
        to={paths.auth.signIn}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (!canAccess) {
    return <Navigate to={paths.dashboard} replace />
  }

  return <Outlet />
}
