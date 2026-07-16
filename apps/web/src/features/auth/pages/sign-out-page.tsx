import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signOut } from "@workspace/auth/client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui-shadcn/components/card"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { routes } from "@/config/routes"

export function SignOutPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      const result = await signOut()
      if (cancelled) return
      if (result.error) {
        setError(result.error.message ?? "Unable to sign out")
        return
      }
      navigate(routes.signIn, { replace: true })
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signing out</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {error ? (
          <div className="flex flex-col gap-2">
            <p className="text-destructive">{error}</p>
            <Link className="underline" to={routes.signIn}>
              Continue to sign in
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Spinner />
            <p>Clearing your session…</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
