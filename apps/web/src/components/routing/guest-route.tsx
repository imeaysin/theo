import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useSession } from "@/lib/auth"
import { Spinner } from "@workspace/ui/components/spinner"
import { paths } from "@/config/paths"

export function GuestRoute() {
  const location = useLocation()
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-6" />
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
