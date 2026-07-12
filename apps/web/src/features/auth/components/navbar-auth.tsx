import { Link } from "react-router-dom"
import { Button } from "@workspace/ui-shadcn/components/button"
import { useAuthSession } from "@workspace/auth/react"
import { routes } from "@/config/routes"

export function NavbarAuth() {
  const { data: session, isPending } = useAuthSession()

  if (isPending) {
    return null
  }

  if (session) {
    return (
      <Button asChild size="sm" variant="outline">
        Dashboard
      </Button>
    )
  }

  return (
    <Button asChild size="sm">
      <Link to={routes.signIn}>Sign in</Link>
    </Button>
  )
}
