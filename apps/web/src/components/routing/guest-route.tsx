import { Navigate, Outlet, useLocation } from "react-router-dom"
import { paths } from "@/config/paths"
import { useAuthSession } from "@/features/auth/hooks"
import { Spinner } from "@workspace/ui/components/spinner"

export function GuestRoute() {
  const location = useLocation()
  const { session, isPending } = useAuthSession()

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-8 text-muted-foreground" />
      </div>
    )
  }

  if (session) {
    const from =
      (location.state as { from?: string } | null)?.from ?? paths.dashboard
    return <Navigate to={from} replace />
  }

  return <Outlet />
}
