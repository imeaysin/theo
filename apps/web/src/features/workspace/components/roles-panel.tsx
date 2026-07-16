import { Button } from "@workspace/ui-shadcn/components/button"
import { Badge } from "@workspace/ui-shadcn/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui-shadcn/components/table"
import { PencilIcon, Trash2Icon } from "lucide-react"
import {
  ASSIGNABLE_ORG_ROLES,
  formatRoleLabel,
  STATIC_ORG_ROLES,
} from "@/features/workspace/lib/org-roles"
import type { WorkspaceRole } from "@/features/workspace/hooks/use-workspace"

type RolesPanelProps = {
  readonly customRoles: readonly WorkspaceRole[]
  readonly canUpdateRoles: boolean
  readonly canDeleteRoles: boolean
  readonly onEdit: (role: WorkspaceRole) => void
  readonly onDelete: (role: WorkspaceRole) => void
}

function permissionSummary(permission: Record<string, string[]>) {
  const parts = Object.entries(permission).flatMap(([resource, actions]) =>
    actions.map((action) => `${resource}:${action}`)
  )
  if (parts.length === 0) return "No permissions"
  if (parts.length <= 4) return parts.join(", ")
  return `${parts.slice(0, 4).join(", ")} +${parts.length - 4}`
}

function isAssignable(role: string) {
  return ASSIGNABLE_ORG_ROLES.some((assignable) => assignable === role)
}

export function RolesPanel({
  customRoles,
  canUpdateRoles,
  canDeleteRoles,
  onEdit,
  onDelete,
}: RolesPanelProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h3 className="text-sm font-medium">Built-in roles</h3>
        <div className="flex flex-wrap gap-2">
          {STATIC_ORG_ROLES.map((role) => (
            <Badge key={role} variant="secondary">
              {formatRoleLabel(role)}
              {isAssignable(role) ? "" : " (system)"}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Built-in roles are defined in code. Custom roles below are stored per
          workspace.
        </p>
      </div>

      <div className="grid gap-2">
        <h3 className="text-sm font-medium">Custom roles</h3>
        {customRoles.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No custom roles yet. Create one to grant a tailored permission set.
          </p>
        ) : (
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
                    {canUpdateRoles || canDeleteRoles ? (
                      <div className="flex justify-end gap-1">
                        {canUpdateRoles ? (
                          <Button
                            aria-label={`Edit ${role.role}`}
                            onClick={() => onEdit(role)}
                            size="icon-sm"
                            type="button"
                            variant="ghost"
                          >
                            <PencilIcon />
                          </Button>
                        ) : null}
                        {canDeleteRoles ? (
                          <Button
                            aria-label={`Delete ${role.role}`}
                            onClick={() => onDelete(role)}
                            size="icon-sm"
                            type="button"
                            variant="ghost"
                          >
                            <Trash2Icon />
                          </Button>
                        ) : null}
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
