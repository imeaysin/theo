import { ShellMain } from "@workspace/ui/components/shell"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"

function getWelcomeSubtitle(name?: string | null) {
  if (name) return `Welcome back, ${name}.`
  return "Welcome back."
}

export function DashboardPage() {
  const { data: session } = useAuthSession()

  return (
    <ShellMain
      heading="Overview"
      subtitle={getWelcomeSubtitle(session?.user.name)}
    >
      <p className="text-sm text-muted-foreground">
        Your scheduling dashboard will appear here.
      </p>
    </ShellMain>
  )
}
