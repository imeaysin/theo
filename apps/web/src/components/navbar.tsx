import { Link } from "react-router-dom"
import { useSession, signOut } from "@workspace/auth/client"
import { Button } from "@workspace/ui-shadcn/components/button"
import { routes } from "@/config/routes"
import { site } from "@/config/site"

export function Navbar() {
  const { data: session, isPending } = useSession()

  let authActions = null
  if (!isPending && session) {
    authActions = (
      <>
        <Button
          nativeButton={false}
          render={<Link to={routes.dashboard} />}
          size="sm"
          variant="ghost"
        >
          App
        </Button>
        <Button
          onClick={() => {
            void signOut()
          }}
          size="sm"
          variant="outline"
        >
          Sign out
        </Button>
      </>
    )
  } else if (!isPending) {
    authActions = (
      <>
        <Button
          nativeButton={false}
          render={<Link to={routes.signIn} />}
          size="sm"
          variant="ghost"
        >
          Sign in
        </Button>
        <Button
          nativeButton={false}
          render={<Link to={routes.signUp} />}
          size="sm"
        >
          Sign up
        </Button>
      </>
    )
  }

  return (
    <header className="sticky top-0 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          className="font-heading text-sm font-semibold tracking-tight"
          to={routes.home}
        >
          {site.name}
        </Link>
        <div className="flex items-center gap-2">{authActions}</div>
      </div>
    </header>
  )
}
