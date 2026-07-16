import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { buttonVariants } from "@workspace/ui-shadcn/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui-shadcn/components/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui-shadcn/components/table"
import type { OrganizationRole } from "@/features/organization/hooks/use-organization-roles"
import {
  countPermissions,
  formatRoleLabel,
} from "@/features/organization/lib/organization-roles"
import { cn } from "@workspace/ui-shadcn/lib/utils"
import { PermissionChips } from "./permission-chips"

type CustomRolesTableProps = {
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
        aria-label={`Actions for ${role.role}`}
        className={cn(buttonVariants({ size: "icon-sm", variant: "ghost" }))}
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canUpdateRoles ? (
          <DropdownMenuItem onClick={() => onEdit(role)}>
            <Pencil />
            Edit role
          </DropdownMenuItem>
        ) : null}
        {canUpdateRoles && canDeleteRoles ? <DropdownMenuSeparator /> : null}
        {canDeleteRoles ? (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(role)}
          >
            <Trash2 />
            Delete role
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CustomRolesTable({
  canDeleteRoles,
  canUpdateRoles,
  customRoles,
  onDelete,
  onEdit,
}: CustomRolesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {customRoles.map((role) => {
          const total = countPermissions(role.permission)
          return (
            <TableRow key={role.id}>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">
                    {formatRoleLabel(role.role)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {total} permission{total === 1 ? "" : "s"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <PermissionChips permission={role.permission} />
              </TableCell>
              <TableCell className="text-right">
                <RoleActionsMenu
                  canDeleteRoles={canDeleteRoles}
                  canUpdateRoles={canUpdateRoles}
                  role={role}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
