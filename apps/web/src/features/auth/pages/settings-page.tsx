import { Link, Navigate } from "react-router-dom"
import { AuthPageBody, AuthPageHeader } from "@workspace/ui/auth"
import { Button } from "@workspace/ui/components/button"
import { PageLoading } from "@workspace/ui/components/page-loading"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { paths } from "@/config/paths"

export function SettingsPage() {
  const { data: session, isPending } = useAuthSession()

  if (isPending) {
    return <PageLoading />
  }

  if (!session) {
    return <Navigate replace to={paths.auth.signIn} />
  }

  return (
    <AuthPageBody>
      <AuthPageHeader
        description="Manage your account settings."
        title="Account"
      />

      <div className="flex flex-col gap-4">
        <dl className="flex flex-col gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd>{session.user.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd>{session.user.email ?? "—"}</dd>
          </div>
        </dl>
        <Button
          className="w-full"
          render={<Link to={paths.auth.signOut} />}
          size="lg"
          type="button"
          variant="outline"
        >
          Sign out
        </Button>
      </div>
    </AuthPageBody>
  )
}
