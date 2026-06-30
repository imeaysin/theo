import { Link } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { defaultAuthenticatedRoute, routes } from "@/config/routes"

export function NavbarAuth() {
  const { data: session, isPending } = useAuthSession()

  if (isPending) {
    return null
  }

  if (session) {
    return (
      <Button
        render={<Link to={defaultAuthenticatedRoute} />}
        size="sm"
        variant="outline"
      >
        Dashboard
      </Button>
    )
  }

  return (
    <Button render={<Link to={routes.signIn} />} size="sm">
      Sign in
    </Button>
  )
}
