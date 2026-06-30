import { Navigate, Outlet } from "react-router-dom"
import { PageLoading } from "@workspace/ui/components/page-loading"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { routes } from "@/config/routes"

export function ProtectedRoute() {
  const { data: session, isPending } = useAuthSession()

  if (isPending) {
    return <PageLoading />
  }

  if (!session) {
    return <Navigate replace to={routes.signIn} />
  }

  return <Outlet />
}
