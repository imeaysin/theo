import { Navigate, Outlet, useLocation } from "react-router-dom"
import { PageLoading } from "@/components/page-loading"
import { useSession } from "@workspace/auth/client"
import { routes } from "@/config/routes"

export function ProtectedRoute() {
  const location = useLocation()
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <PageLoading />
  }

  if (!session) {
    const returnPath = `${location.pathname}${location.search}`
    const signInPath = `${routes.signIn}?redirect=${encodeURIComponent(returnPath)}`
    return <Navigate replace to={signInPath} />
  }

  if ("banned" in session.user && session.user.banned === true) {
    return <Navigate replace to={routes.signOut} />
  }

  if (session.user.emailVerified === false) {
    const email = session.user.email
    const verifyPath = email
      ? `${routes.verifyEmail}?email=${encodeURIComponent(email)}`
      : routes.verifyEmail
    return <Navigate replace to={verifyPath} />
  }

  return <Outlet />
}
