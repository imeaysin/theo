import { Link } from "react-router-dom"
import { Button } from "@workspace/ui-shadcn/components/button"
import { useAuthSession } from "@workspace/auth/react"
import { routes } from "@/config/routes"

export function DashboardPage() {
  const { data: session } = useAuthSession()
  const name = session?.user.name

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          {name ? `Welcome back, ${name}.` : "Welcome back."}
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        This dashboard is a starting point. See Notes for CRUD or Uploads for
        file uploads wired to the API.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to={routes.notes}>Open notes</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={routes.uploads}>Open uploads</Link>
        </Button>
      </div>
    </div>
  )
}
