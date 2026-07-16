import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { OrganizationRole } from "@/features/organization/hooks/use-organization-roles"
import { formatRoleLabel } from "@/features/organization/lib/organization-roles"

type CustomRolesSectionProps = {
  readonly canDeleteRoles: boolean
  readonly canUpdateRoles: boolean
  readonly customRoles: readonly OrganizationRole[]
  readonly isPending: boolean
  readonly onDelete: (role: OrganizationRole) => void
  readonly onEdit: (role: OrganizationRole) => void
}

function permissionSummary(permission: Record<string, string[]>) {
  const parts = Object.entries(permission).flatMap(([resource, actions]) =>
    actions.map((action) => `${resource}:${action}`)
  )
  if (parts.length === 0) return "No permissions"
  if (parts.length <= 4) return parts.join(", ")
  return `${parts.slice(0, 4).join(", ")} +${parts.length - 4}`
}

function CustomRolesTable({
  canDeleteRoles,
  canUpdateRoles,
  customRoles,
  onDelete,
  onEdit,
}: Omit<CustomRolesSectionProps, "isPending">) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead className="w-28 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customRoles.map((role) => (
          <TableRow key={role.id}>
            <TableCell className="font-medium">
              {formatRoleLabel(role.role)}
            </TableCell>
            <TableCell className="max-w-md text-xs text-muted-foreground">
              {permissionSummary(role.permission)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                {canUpdateRoles ? (
                  <Button
                    aria-label={`Edit ${role.role}`}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                    onClick={() => onEdit(role)}
                  >
                    <Pencil />
                  </Button>
                ) : null}
                {canDeleteRoles ? (
                  <Button
                    aria-label={`Delete ${role.role}`}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                    onClick={() => onDelete(role)}
                  >
                    <Trash2 />
                  </Button>
                ) : null}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function renderCustomRolesContent(props: CustomRolesSectionProps) {
  if (props.isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }
  if (props.customRoles.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No custom roles yet. Create one to grant a tailored permission set.
      </p>
    )
  }
  return <CustomRolesTable {...props} />
}

export function CustomRolesSection(props: CustomRolesSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">Custom roles</p>
      {renderCustomRolesContent(props)}
    </div>
  )
}
