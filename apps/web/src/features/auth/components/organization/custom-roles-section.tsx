import { Plus } from "lucide-react"

import { Button } from "@workspace/ui-shadcn/components/button"
import { Card } from "@workspace/ui-shadcn/components/card"
import { Skeleton } from "@workspace/ui-shadcn/components/skeleton"
import type { OrganizationRole } from "@/features/organization/hooks/use-organization-roles"
import { CustomRolesTable } from "@/features/auth/components/organization/custom-roles-table"

type CustomRolesSectionProps = {
  readonly canCreateRoles: boolean
  readonly canDeleteRoles: boolean
  readonly canUpdateRoles: boolean
  readonly customRoles: readonly OrganizationRole[]
  readonly isPending: boolean
  readonly onCreate: () => void
  readonly onDelete: (role: OrganizationRole) => void
  readonly onEdit: (role: OrganizationRole) => void
}

function CustomRolesEmpty({
  canCreateRoles,
  onCreate,
}: {
  readonly canCreateRoles: boolean
  readonly onCreate: () => void
}) {
  return (
    <div className="flex flex-col items-start gap-3 px-4 py-10">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">No custom roles yet</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Create a role with a tailored permission set, then assign it when you
          invite or update members.
        </p>
      </div>
      {canCreateRoles ? (
        <Button size="sm" onClick={onCreate}>
          <Plus />
          Create role
        </Button>
      ) : null}
    </div>
  )
}

function renderCustomRolesBody(props: CustomRolesSectionProps) {
  if (props.isPending) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }
  if (props.customRoles.length === 0) {
    return (
      <CustomRolesEmpty
        canCreateRoles={props.canCreateRoles}
        onCreate={props.onCreate}
      />
    )
  }
  return <CustomRolesTable {...props} />
}

export function CustomRolesSection(props: CustomRolesSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="truncate text-sm font-semibold">Custom roles</h3>
          <p className="text-xs text-muted-foreground">
            Stored per organization. Permissions cannot exceed your own access.
          </p>
        </div>
        {props.canCreateRoles && props.customRoles.length > 0 ? (
          <Button
            className="shrink-0"
            size="sm"
            disabled={props.isPending}
            onClick={props.onCreate}
          >
            <Plus />
            Create role
          </Button>
        ) : null}
      </div>

      <Card className="overflow-hidden p-0">
        {renderCustomRolesBody(props)}
      </Card>
    </div>
  )
}
