import { Navigate, Outlet, useLocation } from "react-router-dom"
import type { AuthUser } from "@workspace/auth/types"
import { PageLoading } from "@workspace/ui-shadcn/components/page-loading"
import { useAuthSession } from "@workspace/auth/react"
import { routes } from "@/config/routes"

function getSessionAccessRedirect(user: AuthUser): string | null {
  if ("banned" in user && user.banned) {
    return routes.signOut
  }

  if ("emailVerified" in user && user.emailVerified === false) {
    const email = typeof user.email === "string" ? user.email : ""
    return email
      ? `${routes.verifyEmail}?email=${encodeURIComponent(email)}`
      : routes.verifyEmail
  }

  return null
}

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

  const accessRedirect = getSessionAccessRedirect(session.user)
  if (accessRedirect) {
    return <Navigate replace to={accessRedirect} />
  }

  return <Outlet />
}
