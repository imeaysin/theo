import { Link } from "react-router-dom"
import { useSession } from "@/lib/auth"
import { Button } from "@workspace/ui/components/button"
import { paths } from "@/config/paths"
import { env } from "@/config/env"

export function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex max-w-lg flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{env.appName}</h1>
        <p className="text-sm text-muted-foreground">
          {session
            ? `Signed in as ${session.user.email}.`
            : "Sign in to access your dashboard."}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {session ? (
          <Button render={<Link to={paths.dashboard} />}>
            Go to dashboard
          </Button>
        ) : (
          <>
            <Button render={<Link to={paths.auth.signIn} />}>Sign in</Button>
            <Button render={<Link to={paths.auth.signUp} />} variant="outline">
              Sign up
            </Button>
          </>
        )}
      </div>
      <p className="font-mono text-xs text-muted-foreground">
        Press <kbd>d</kbd> to toggle dark mode
      </p>
    </div>
  )
}
