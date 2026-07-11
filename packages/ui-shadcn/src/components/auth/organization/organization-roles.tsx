"use client"

import {
  formatOrganizationRoleLabel,
  getStaticOrganizationRoleNames,
} from "@workspace/auth/permissions/organization"
import {
  useListOrganizationRoles,
  useOrganizationPermission,
} from "@workspace/auth/react"
import type { OrganizationRole } from "@workspace/auth/types/organization"
import { Button } from "@workspace/ui-shadcn/components/button"
import { Card } from "@workspace/ui-shadcn/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui-shadcn/components/table"
import { cn } from "@workspace/ui-shadcn/lib/utils"
import type { CreateOrganizationRoleDialogProps } from "./create-organization-role-dialog"
import { CreateOrganizationRoleDialog } from "./create-organization-role-dialog"
import type { ConfirmDeleteOrganizationRoleDialogProps } from "./confirm-delete-organization-role-dialog"
import { ConfirmDeleteOrganizationRoleDialog } from "./confirm-delete-organization-role-dialog"
import type { EditOrganizationRoleDialogProps } from "./edit-organization-role-dialog"
import { EditOrganizationRoleDialog } from "./edit-organization-role-dialog"
import { OrganizationRoleRow } from "./organization-role-row"
import { organizationUiPermissions } from "./ui-permissions"

export type OrganizationRolesProps = {
  className?: string
  createDialog?: CreateOrganizationRoleDialogProps
  editDialog?: EditOrganizationRoleDialogProps
  deleteDialog?: ConfirmDeleteOrganizationRoleDialogProps
  onCreateClick?: () => void
  onEditRole?: (role: OrganizationRole) => void
  onDeleteRole?: (role: OrganizationRole) => void
}

export function OrganizationRoles({
  className,
  createDialog,
  editDialog,
  deleteDialog,
  onCreateClick,
  onEditRole,
  onDeleteRole,
}: OrganizationRolesProps) {
  const { data: listPermission, isPending: listPermissionPending } =
    useOrganizationPermission(organizationUiPermissions.listRoles)
  const { data: createPermission } = useOrganizationPermission(
    organizationUiPermissions.createRole
  )
  const { data: roles, isPending: rolesPending } = useListOrganizationRoles()

  const canListRoles = !!listPermission?.success
  const canCreateRole = !!createPermission?.success
  const customRoles = roles ?? []
  const isPending = listPermissionPending || rolesPending

  if (!listPermissionPending && !canListRoles) {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        You do not have permission to view workspace roles.
      </Card>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Built-in roles</h3>
            <p className="text-sm text-muted-foreground">
              Owner, admin, and member are managed by the system.
            </p>
          </div>
        </div>

        <Card className="divide-y p-0">
          {getStaticOrganizationRoleNames().map((roleName) => (
            <div
              className="flex items-center justify-between px-4 py-3 text-sm"
              key={roleName}
            >
              <span className="font-medium">
                {formatOrganizationRoleLabel(roleName)}
              </span>
              <span className="text-muted-foreground">Built-in</span>
            </div>
          ))}
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Custom roles</h3>
            <p className="text-sm text-muted-foreground">
              Create roles with tailored permissions for your workspace.
            </p>
          </div>
          {canCreateRole && onCreateClick ? (
            <Button onClick={onCreateClick} size="sm" type="button">
              Create role
            </Button>
          ) : null}
        </div>

        <Card className="p-0">
          <Table aria-label="Custom workspace roles">
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <div className="h-8 animate-pulse rounded-md bg-muted" />
                  </TableCell>
                </TableRow>
              ) : null}
              {!isPending && customRoles.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="py-8 text-center text-muted-foreground"
                    colSpan={3}
                  >
                    No custom roles yet.
                  </TableCell>
                </TableRow>
              ) : null}
              {!isPending
                ? customRoles.map((role) => (
                    <OrganizationRoleRow
                      key={role.id}
                      onDelete={onDeleteRole ?? (() => undefined)}
                      onEdit={onEditRole ?? (() => undefined)}
                      role={role}
                    />
                  ))
                : null}
            </TableBody>
          </Table>
        </Card>
      </section>

      {createDialog ? <CreateOrganizationRoleDialog {...createDialog} /> : null}
      {editDialog ? <EditOrganizationRoleDialog {...editDialog} /> : null}
      {deleteDialog ? (
        <ConfirmDeleteOrganizationRoleDialog {...deleteDialog} />
      ) : null}
    </div>
  )
}
