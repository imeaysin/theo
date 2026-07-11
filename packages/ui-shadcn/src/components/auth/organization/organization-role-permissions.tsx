"use client"

import type { OrganizationPermissionMap } from "@workspace/auth/permissions/organization"
import {
  formatOrganizationPermissionLabel,
  hasOrganizationPermission,
  organizationPermissionMatrix,
  toggleOrganizationPermission,
} from "@workspace/auth/permissions/organization"
import { Card } from "@workspace/ui-shadcn/components/card"
import { Checkbox } from "@workspace/ui-shadcn/components/checkbox"
import { FieldLabel } from "@workspace/ui-shadcn/components/field"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui-shadcn/components/table"
import { cn } from "@workspace/ui-shadcn/lib/utils"

const CRUD_ACTIONS = ["create", "read", "update", "delete"] as const

const actionColumns = CRUD_ACTIONS.filter((action) =>
  organizationPermissionMatrix.some(({ actions }) =>
    (actions as readonly string[]).includes(action)
  )
)

type PermissionCellProps = {
  actionLabel: string
  checked: boolean
  disabled: boolean
  id: string
  onToggle: (enabled: boolean) => void
  resourceLabel: string
}

function PermissionCell({
  actionLabel,
  checked,
  disabled,
  id,
  onToggle,
  resourceLabel,
}: PermissionCellProps) {
  return (
    <TableCell className="p-0 text-center">
      <FieldLabel
        className={cn(
          "flex min-h-9 w-full cursor-pointer items-center justify-center",
          disabled && "cursor-default opacity-80"
        )}
        htmlFor={id}
      >
        <Checkbox
          checked={checked}
          disabled={disabled}
          id={id}
          onCheckedChange={(nextChecked) => onToggle(nextChecked === true)}
        />
        <span className="sr-only">
          {resourceLabel} {actionLabel}
        </span>
      </FieldLabel>
    </TableCell>
  )
}

export type OrganizationRolePermissionsProps = {
  className?: string
  permissions: OrganizationPermissionMap
  onChange?: (permissions: OrganizationPermissionMap) => void
  disabled?: boolean
}

export function OrganizationRolePermissions({
  className,
  permissions,
  onChange,
  disabled = false,
}: OrganizationRolePermissionsProps) {
  const readOnly = disabled || !onChange

  return (
    <Card className={cn("w-full self-stretch p-0", className)}>
      <Table aria-label="Role permissions" className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="ps-4">Resource</TableHead>
            {actionColumns.map((action) => (
              <TableHead className="text-center" key={action}>
                {formatOrganizationPermissionLabel(action)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizationPermissionMatrix.map((row) => {
            const resourceLabel = formatOrganizationPermissionLabel(
              row.resource
            )

            return (
              <TableRow key={row.resource}>
                <TableCell
                  className="truncate ps-4 text-sm font-medium"
                  title={resourceLabel}
                >
                  {resourceLabel}
                </TableCell>
                {actionColumns.map((action) => {
                  if (!(row.actions as readonly string[]).includes(action)) {
                    return <TableCell key={action} />
                  }

                  const checked = hasOrganizationPermission(
                    permissions,
                    row.resource,
                    action as (typeof row.actions)[number]
                  )
                  const id = `role-permission-${row.resource}-${action}`
                  const actionLabel = formatOrganizationPermissionLabel(action)

                  return (
                    <PermissionCell
                      actionLabel={actionLabel}
                      checked={checked}
                      disabled={readOnly}
                      id={id}
                      key={action}
                      onToggle={(enabled) => {
                        if (!onChange) return
                        onChange(
                          toggleOrganizationPermission(
                            permissions,
                            row.resource,
                            action as (typeof row.actions)[number],
                            enabled
                          )
                        )
                      }}
                      resourceLabel={resourceLabel}
                    />
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}
