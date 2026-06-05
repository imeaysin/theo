import { Link } from "react-router-dom"
import { Button } from "@workspace/hero-ui"
import { paths } from "@/config/paths"
import { env } from "@/config/env"
import { useAuthSession } from "@/features/auth/hooks"

export function HomePage() {
  const { session } = useAuthSession()

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex max-w-lg flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{env.appName}</h1>
        <p className="text-sm text-muted-foreground">
          {session?.user
            ? `Signed in as ${session.user.email}.`
            : "Sign in to access your dashboard."}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {session ? (
          <Link to={paths.dashboard}>
            <Button>Go to dashboard</Button>
          </Link>
        ) : (
          <>
            <Link to={paths.auth.signIn}>
              <Button>Sign in</Button>
            </Link>
            <Link to={paths.auth.signUp}>
              <Button variant="outline">Sign up</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
