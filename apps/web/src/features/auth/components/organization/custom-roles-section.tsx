import { Plus, Shield } from "lucide-react"

import { Button } from "@workspace/ui-shadcn/components/button"
import { DataTableSkeleton } from "@workspace/ui-shadcn/components/data-table-skeleton"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui-shadcn/components/empty"
import type { OrganizationRole } from "@/features/organization/hooks/use-organization-roles"
import { SectionHeader } from "@/components/page-header"
import { CustomRolesList } from "@/features/auth/components/organization/custom-roles-list"

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
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Shield />
        </EmptyMedia>
        <EmptyTitle>No custom roles yet</EmptyTitle>
        <EmptyDescription>
          Create a role with a tailored permission set, then assign it when you
          invite or update members.
        </EmptyDescription>
      </EmptyHeader>
      {canCreateRoles ? (
        <EmptyContent>
          <Button size="sm" onClick={onCreate}>
            <Plus data-icon="inline-start" />
            Create role
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  )
}

function renderCustomRolesBody(props: CustomRolesSectionProps) {
  if (props.isPending) {
    return <DataTableSkeleton columnCount={3} />
  }
  if (props.customRoles.length === 0) {
    return (
      <CustomRolesEmpty
        canCreateRoles={props.canCreateRoles}
        onCreate={props.onCreate}
      />
    )
  }
  return <CustomRolesList {...props} />
}

export function CustomRolesSection(props: CustomRolesSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <SectionHeader
        actions={
          props.canCreateRoles && props.customRoles.length > 0 ? (
            <Button
              size="sm"
              disabled={props.isPending}
              onClick={props.onCreate}
            >
              <Plus data-icon="inline-start" />
              Create role
            </Button>
          ) : null
        }
        description="Stored per organization. Permissions cannot exceed your own access."
        title="Custom roles"
      />

      {renderCustomRolesBody(props)}
    </div>
  )
}
