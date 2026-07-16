"use client"

import { authClient as theoAuthClient } from "@workspace/auth/client"
import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth,
} from "@better-auth-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState, type ComponentProps } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RoleFormDialog } from "@/features/workspace/components/role-form-dialog"
import {
  useWorkspaceRoles,
  workspaceRolesKey,
  type WorkspaceRole,
} from "@/features/workspace/hooks/use-workspace"
import { useWorkspacePermissions } from "@/features/workspace/hooks/use-workspace-permissions"
import {
  ASSIGNABLE_ORG_ROLES,
  STATIC_ORG_ROLES,
  formatRoleLabel,
} from "@/features/workspace/lib/org-roles"
import { cn } from "@/lib/utils"

export type OrganizationRolesProps = {
  className?: string
}

function permissionSummary(permission: Record<string, string[]>) {
  const parts = Object.entries(permission).flatMap(([resource, actions]) =>
    actions.map((action) => `${resource}:${action}`)
  )
  if (parts.length === 0) return "No permissions"
  if (parts.length <= 4) return parts.join(", ")
  return `${parts.slice(0, 4).join(", ")} +${parts.length - 4}`
}

/**
 * Custom (dynamic) organization role management.
 * Better Auth UI has no role CRUD — only assign/invite with static role labels.
 */
export function OrganizationRoles({
  className,
  ...props
}: OrganizationRolesProps & ComponentProps<"div">) {
  const { authClient } = useAuth()
  const queryClient = useQueryClient()
  const { data: organization, isPending: orgPending } = useActiveOrganization(
    authClient as OrganizationAuthClient
  )
  const permissions = useWorkspacePermissions(organization?.id)
  const rolesQuery = useWorkspaceRoles(
    permissions.canListRoles ? organization?.id : null
  )

  const [roleFormOpen, setRoleFormOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<WorkspaceRole | null>(null)
  const [roleToDelete, setRoleToDelete] = useState<WorkspaceRole | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const customRoles = rolesQuery.data ?? []
  const isPending = orgPending || permissions.isPending || rolesQuery.isPending

  async function refreshRoles() {
    if (!organization?.id) return
    await queryClient.invalidateQueries({
      queryKey: workspaceRolesKey(organization.id),
    })
  }

  async function handleDelete() {
    if (!roleToDelete) return
    setIsDeleting(true)
    const result = await theoAuthClient.organization.deleteRole({
      roleId: roleToDelete.id,
    })
    setIsDeleting(false)
    if (result.error) {
      toast.error(result.error.message ?? "Could not delete role")
      return
    }
    toast.success(`Deleted role ${roleToDelete.role}`)
    setRoleToDelete(null)
    await refreshRoles()
  }

  if (!permissions.canListRoles && !permissions.isPending) {
    return null
  }

  return (
    <div className={cn("flex w-full flex-col", className)} {...props}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Roles</h2>
        {permissions.canCreateRoles ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingRole(null)
              setRoleFormOpen(true)
            }}
          >
            <Plus />
            Create role
          </Button>
        ) : null}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Built-in roles</p>
            <div className="flex flex-wrap gap-2">
              {STATIC_ORG_ROLES.map((role) => (
                <Badge key={role} variant="secondary">
                  {formatRoleLabel(role)}
                  {ASSIGNABLE_ORG_ROLES.some(
                    (assignable) => assignable === role
                  )
                    ? ""
                    : " (system)"}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Built-in roles are defined in code. Custom roles below are stored
              per organization.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Custom roles</p>
            {isPending ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : customRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No custom roles yet. Create one to grant a tailored permission
                set.
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
                        <div className="flex justify-end gap-1">
                          {permissions.canUpdateRoles ? (
                            <Button
                              aria-label={`Edit ${role.role}`}
                              size="icon-sm"
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setEditingRole(role)
                                setRoleFormOpen(true)
                              }}
                            >
                              <Pencil />
                            </Button>
                          ) : null}
                          {permissions.canDeleteRoles ? (
                            <Button
                              aria-label={`Delete ${role.role}`}
                              size="icon-sm"
                              type="button"
                              variant="ghost"
                              onClick={() => setRoleToDelete(role)}
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
            )}
          </div>
        </CardContent>
      </Card>

      <RoleFormDialog
        open={roleFormOpen}
        editingRole={editingRole}
        onOpenChange={setRoleFormOpen}
        onSaved={() => {
          void refreshRoles()
        }}
      />

      <AlertDialog
        open={roleToDelete != null}
        onOpenChange={(open) => {
          if (!open) setRoleToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role</AlertDialogTitle>
            <AlertDialogDescription>
              Delete{" "}
              <span className="font-medium text-foreground">
                {roleToDelete ? formatRoleLabel(roleToDelete.role) : ""}
              </span>
              ? Members using this role must be reassigned first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault()
                void handleDelete()
              }}
            >
              {isDeleting ? <Spinner /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
