"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useMemo } from "react"

import { Button } from "@workspace/ui-shadcn/components/button"
import { DataTable } from "@workspace/ui-shadcn/components/data-table"
import { DataTableColumnHeader } from "@workspace/ui-shadcn/components/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui-shadcn/components/dropdown-menu"
import type { OrganizationRole } from "@/features/organization/hooks/use-organization-roles"
import {
  countPermissions,
  formatRoleLabel,
} from "@/features/organization/lib/organization-roles"
import { PermissionChips } from "./permission-chips"

type CustomRolesListProps = {
  readonly canDeleteRoles: boolean
  readonly canUpdateRoles: boolean
  readonly customRoles: readonly OrganizationRole[]
  readonly onDelete: (role: OrganizationRole) => void
  readonly onEdit: (role: OrganizationRole) => void
}

function RoleActionsMenu({
  canDeleteRoles,
  canUpdateRoles,
  role,
  onDelete,
  onEdit,
}: {
  readonly canDeleteRoles: boolean
  readonly canUpdateRoles: boolean
  readonly role: OrganizationRole
  readonly onDelete: (role: OrganizationRole) => void
  readonly onEdit: (role: OrganizationRole) => void
}) {
  if (!canUpdateRoles && !canDeleteRoles) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={`Actions for ${role.role}`}
            size="icon-sm"
            type="button"
            variant="outline"
          />
        }
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canUpdateRoles ? (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => onEdit(role)}>
              <Pencil />
              Edit role
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : null}
        {canUpdateRoles && canDeleteRoles ? <DropdownMenuSeparator /> : null}
        {canDeleteRoles ? (
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(role)}
            >
              <Trash2 />
              Delete role
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getCustomRolesColumns({
  canDeleteRoles,
  canUpdateRoles,
  onDelete,
  onEdit,
}: Omit<CustomRolesListProps, "customRoles">): ColumnDef<OrganizationRole>[] {
  return [
    {
      id: "role",
      accessorFn: (row) => formatRoleLabel(row.role),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{formatRoleLabel(row.original.role)}</div>
      ),
    },
    {
      id: "permissions",
      accessorFn: (row) => countPermissions(row.permission),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Permissions" />
      ),
      cell: ({ row }) => {
        const total = countPermissions(row.original.permission)
        return (
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground">
              {total} permission{total === 1 ? "" : "s"}
            </span>
            <PermissionChips permission={row.original.permission} />
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <RoleActionsMenu
          canDeleteRoles={canDeleteRoles}
          canUpdateRoles={canUpdateRoles}
          role={row.original}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ),
    },
  ]
}

export function CustomRolesList({
  canDeleteRoles,
  canUpdateRoles,
  customRoles,
  onDelete,
  onEdit,
}: CustomRolesListProps) {
  const columns = useMemo(
    () =>
      getCustomRolesColumns({
        canDeleteRoles,
        canUpdateRoles,
        onDelete,
        onEdit,
      }),
    [canDeleteRoles, canUpdateRoles, onDelete, onEdit]
  )

  return (
    <DataTable
      columns={columns}
      data={[...customRoles]}
      filterColumn="role"
      filterPlaceholder="Filter roles..."
      getRowId={(role) => role.id}
      initialSorting={[{ id: "role", desc: false }]}
    />
  )
}
