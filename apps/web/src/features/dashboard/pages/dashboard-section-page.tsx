import { useLocation } from "react-router-dom"
import { ShellMain } from "@workspace/ui/components/shell"
import { paths } from "@/config/paths"

const sectionTitles: Record<string, string> = {
  bookings: "Bookings",
  availability: "Availability",
  "routing-forms": "Routing forms",
  workflows: "Workflows",
  insights: "Insights",
  apps: "Apps",
  installed: "Installed apps",
}

function resolveSectionTitle(pathname: string): string {
  const relative = pathname.replace(`${paths.dashboard}/`, "")
  const segment = relative.split("/").pop() ?? "Section"
  return (
    sectionTitles[relative] ??
    sectionTitles[segment] ??
    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
  )
}

export function DashboardSectionPage() {
  const { pathname } = useLocation()
  const title = resolveSectionTitle(pathname)

  return (
    <ShellMain heading={title} subtitle="This section is under development.">
      <p className="text-sm text-muted-foreground">
        Check back soon for updates.
      </p>
    </ShellMain>
  )
}
