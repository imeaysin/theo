import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@workspace/ui/components/card"
import { ShellMain } from "@workspace/ui/components/shell"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"

const stats = [
  { label: "Revenue", value: "$12,450", change: "+12% from last month" },
  { label: "Outstanding invoices", value: "8", change: "3 due this week" },
  { label: "Transactions", value: "142", change: "Synced today" },
]

export function DashboardPage() {
  const { data: session } = useAuthSession()

  return (
    <ShellMain
      heading="Overview"
      subtitle={`Welcome back${
        session?.user.name ? `, ${session.user.name}` : ""
      }.`}
    >
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
    </ShellMain>
  )
}
