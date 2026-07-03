import { Link } from "react-router-dom"
import { ShellMain } from "@workspace/ui/components/shell"
import { Button } from "@workspace/ui/components/button"
import { useAuthSession } from "@workspace/auth/react"
import { routes } from "@/config/routes"

export function DashboardPage() {
  const { data: session } = useAuthSession()
  const name = session?.user.name

  return (
    <ShellMain
      header={{
        heading: "Overview",
        subtitle: name ? `Welcome back, ${name}.` : "Welcome back.",
      }}
    >
      <p className="mb-4 text-sm text-muted-foreground">
        This dashboard is a starting point. See Notes for CRUD or Uploads for
        file uploads wired to the API.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button render={<Link to={routes.notes} />} variant="outline">
          Open notes
        </Button>
        <Button render={<Link to={routes.uploads} />} variant="outline">
          Open uploads
        </Button>
      </div>
    </ShellMain>
  )
}
