import { ShellMain } from "@workspace/ui/components/shell"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"

export function DashboardPage() {
  const { data: session } = useAuthSession()

  return (
    <ShellMain
      heading="Overview"
      subtitle={`Welcome back${
        session?.user.name ? `, ${session.user.name}` : ""
      }.`}
    >
      <div>
        <h1>Dashboard</h1>
      </div>
    </ShellMain>
  )
}
