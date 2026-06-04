import { useAuthSession } from "@/features/auth/hooks"
import { Card } from "@workspace/hero-ui"

export function DashboardPage() {
  const { session } = useAuthSession()
  const user = session?.user

  return (
    <div className="mx-auto flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Protected area — only visible when signed in.
        </p>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Session</Card.Title>
          <Card.Description>Current user from Better Auth.</Card.Description>
        </Card.Header>
        <Card.Content className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Name:</span> {user?.name}
          </p>
          <p>
            <span className="text-muted-foreground">Email:</span> {user?.email}
          </p>
          <p>
            <span className="text-muted-foreground">Verified:</span>{" "}
            {user?.emailVerified ? "Yes" : "No"}
          </p>
        </Card.Content>
      </Card>
    </div>
  )
}
