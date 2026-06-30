import { Link } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { paths } from "@/config/paths"

export function NavbarAuth() {
  const { data: session, isPending } = useAuthSession()

  if (isPending) {
    return null
  }

  if (session) {
    return (
      <Button
        render={<Link to={paths.dashboard} />}
        size="sm"
        variant="outline"
      >
        Dashboard
      </Button>
    )
  }

  return (
    <Button render={<Link to={paths.auth.signIn} />} size="sm">
      Sign in
    </Button>
  )
}
