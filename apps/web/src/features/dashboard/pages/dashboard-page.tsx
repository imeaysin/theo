import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@workspace/ui/components/card"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"

const stats = [
  { label: "Revenue", value: "$12,450", change: "+12% from last month" },
  { label: "Outstanding invoices", value: "8", change: "3 due this week" },
  { label: "Transactions", value: "142", change: "Synced today" },
]

export function DashboardPage() {
  const { data: session } = useAuthSession()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back{session?.user.name ? `, ${session.user.name}` : ""}.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardPanel>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardPanel>
          </Card>
        ))}
      </div>
    </div>
  )
}
