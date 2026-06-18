import { Card } from "@workspace/hero-ui"
import { useAuthSession } from "@/features/auth/hooks"
import { useCan } from "@/features/auth/hooks/use-can"

export function AdminDashboardPage() {
  const { session } = useAuthSession()
  const canListUsers = useCan({ user: ["list"] }, session?.user?.role)

  return (
    <div className="mx-auto flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          {canListUsers ? "Super admin area." : "Restricted area."}
        </p>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Admin Access</Card.Title>
          <Card.Description>
            You are logged in with admin privileges.
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Role:</span>{" "}
            {session?.user?.role}
          </p>
        </Card.Content>
      </Card>
    </div>
  )
}
