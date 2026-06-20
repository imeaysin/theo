import { Navigate, Outlet, useLocation } from "react-router-dom"
import { Spinner } from "@workspace/ui/components/spinner"
import { paths } from "@/config/paths"
import { useAuthSession } from "@/features/auth/hooks"

export function ProtectedRoute() {
  const location = useLocation()
  const { session, isPending } = useAuthSession()

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

  return <Outlet />
}
