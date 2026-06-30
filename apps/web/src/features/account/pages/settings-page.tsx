import { Link } from "react-router-dom"
import { ShellMain } from "@workspace/ui/components/shell"
import { Button } from "@workspace/ui/components/button"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { routes } from "@/config/routes"

export function SettingsPage() {
  const { data: session } = useAuthSession()

  return (
    <ShellMain heading="Account" subtitle="Manage your account settings.">
      <div className="flex max-w-md flex-col gap-4">
        <dl className="flex flex-col gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd>{session?.user.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd>{session?.user.email ?? "—"}</dd>
          </div>
        </dl>
        <Button
          className="w-fit"
          render={<Link to={routes.signOut} />}
          type="button"
          variant="outline"
        >
          Sign out
        </Button>
      </div>
    </ShellMain>
  )
}
