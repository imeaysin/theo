import { Link, Outlet, useNavigate } from "react-router-dom"
import { signOut, useSession } from "@/lib/auth"
import { Button, Spinner } from "@workspace/hero-ui"
import { env } from "@/config/env"
import { paths } from "@/config/paths"

export function AppLayout() {
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()

  async function handleSignOut() {
    await signOut()
    navigate(paths.auth.signIn, { replace: true })
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link to={paths.dashboard} className="text-sm font-medium">
          {env.appName}
        </Link>
        <div className="flex items-center gap-3">
          {isPending ? (
            <Spinner size="sm" />
          ) : (
            <span className="text-sm text-muted-foreground">
              {session?.user.email}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onPress={() => void handleSignOut()}
          >
            Sign out
          </Button>
        </div>
      </header>
      <main className="flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
