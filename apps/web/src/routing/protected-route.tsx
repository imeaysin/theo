import { Navigate, Outlet, useLocation } from "react-router-dom"
import { PageLoading } from "@workspace/ui/components/page-loading"
import { useAuthSession } from "@workspace/auth/react"
import { routes } from "@/config/routes"

export function ProtectedRoute() {
  const location = useLocation()
  const { data: session, isPending } = useAuthSession()

  if (isPending) {
    return <PageLoading />
  }

  if (!session) {
    const returnPath = `${location.pathname}${location.search}`
    const signInPath = `${routes.signIn}?redirect=${encodeURIComponent(returnPath)}`

    return <Navigate replace to={signInPath} />
  }

  return <Outlet />
}
