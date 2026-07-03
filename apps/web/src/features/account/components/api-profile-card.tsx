import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { useMe } from "@/features/account/hooks/use-me"

export function ApiProfileCard() {
  const { data, isPending, isError } = useMe()

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API profile</CardTitle>
          <CardDescription>Loading JWT claims from GET /v1/me…</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isError || !data) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API profile</CardTitle>
        <CardDescription>
          Verified JWT claims returned by the Nest API.
        </CardDescription>
      </CardHeader>
      <dl className="grid gap-3 px-6 pb-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">User id</dt>
          <dd className="font-mono text-xs">{data.id}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd>{data.email}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Role</dt>
          <dd>{data.role}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Workspace</dt>
          <dd className="font-mono text-xs">
            {data.activeOrganizationId ?? "—"}
          </dd>
        </div>
        {data.organizationRole ? (
          <div>
            <dt className="text-muted-foreground">Workspace role</dt>
            <dd>{data.organizationRole}</dd>
          </div>
        ) : null}
      </dl>
    </Card>
  )
}
