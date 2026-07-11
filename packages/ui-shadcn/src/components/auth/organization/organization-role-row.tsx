"use client"

import {
  countOrganizationPermissions,
  formatOrganizationRoleLabel,
} from "@workspace/auth/permissions/organization"
import { useOrganizationPermission } from "@workspace/auth/react"
import type { OrganizationRole } from "@workspace/auth/types/organization"
import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "@workspace/ui-shadcn/components/badge"
import { Button } from "@workspace/ui-shadcn/components/button"
import { TableCell, TableRow } from "@workspace/ui-shadcn/components/table"
import { organizationUiPermissions } from "./ui-permissions"

export type OrganizationRoleRowProps = {
  role: OrganizationRole
  onEdit: (role: OrganizationRole) => void
  onDelete: (role: OrganizationRole) => void
}

export function OrganizationRoleRow({
  role,
  onEdit,
  onDelete,
}: OrganizationRoleRowProps) {
  const { data: canUpdate, isPending: updatePending } =
    useOrganizationPermission(organizationUiPermissions.updateRole)
  const { data: canDelete, isPending: deletePending } =
    useOrganizationPermission(organizationUiPermissions.deleteRole)

  if (updatePending || deletePending) {
    return (
      <TableRow>
        <TableCell colSpan={3}>
          <div className="h-8 animate-pulse rounded-md bg-muted" />
        </TableCell>
      </TableRow>
    )
  }

  const permissionCount = countOrganizationPermissions(role.permission)

  return (
    <TableRow>
      <TableCell className="font-medium">
        {formatOrganizationRoleLabel(role.role)}
      </TableCell>
      <TableCell>
        <Badge variant="secondary">
          {permissionCount} permission{permissionCount === 1 ? "" : "s"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          {canUpdate?.success ? (
            <Button
              aria-label={`Edit ${role.role} role`}
              onClick={() => onEdit(role)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Pencil className="size-4" />
            </Button>
          ) : null}
          {canDelete?.success ? (
            <Button
              aria-label={`Delete ${role.role} role`}
              onClick={() => onDelete(role)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  )
}
