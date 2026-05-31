import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useSession } from "@/lib/auth"
import { Spinner } from "@workspace/ui/components/spinner"
import { paths } from "@/config/paths"

export function ProtectedRoute() {
  const location = useLocation()
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-6" />
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
