"use client"

import {
  useActiveOrganization,
  useAssignableOrganizationRoles,
  useOrganizationPermission,
  useSession,
  useUpdateMemberRole,
} from "@workspace/auth/react"
import type { OrganizationMember } from "@workspace/auth/types/organization"
import { LogOut, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@workspace/ui/components/menu"
import { Spinner } from "@workspace/ui/components/spinner"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import { toastManager } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import { AuthUserView } from "../auth-user-view"
import { LeaveOrganizationDialog } from "./leave-organization-dialog"
import { RemoveMemberDialog } from "./remove-member-dialog"
import { organizationUiPermissions } from "./ui-permissions"

export interface OrganizationMemberRowProps {
  member: OrganizationMember
}

export function OrganizationMemberRow({ member }: OrganizationMemberRowProps) {
  const { data: session } = useSession()
  const { data: activeOrganization } = useActiveOrganization()
  const { data: hasUpdatePermission, isPending: updatePermissionPending } =
    useOrganizationPermission(organizationUiPermissions.updateMember)
  const { data: hasDeletePermission, isPending: deletePermissionPending } =
    useOrganizationPermission(organizationUiPermissions.removeMember)
  const { roles: assignableRoles, formatOrganizationRoleLabel: formatRole } =
    useAssignableOrganizationRoles()
  const { mutate: updateMemberRole, isPending: isUpdatingRole } =
    useUpdateMemberRole()

  const [removeOpen, setRemoveOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)

  const isPending = updatePermissionPending || deletePermissionPending
  const isCurrentUser = session?.user.id === member.userId

  if (isPending) {
    return (
      <TableRow>
        <TableCell colSpan={3}>
          <div className="h-8 animate-pulse rounded-md bg-muted" />
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell>
        <AuthUserView user={member.user} />
      </TableCell>

      <TableCell>{formatRole(member.role)}</TableCell>

      <TableCell>
        <div className="flex items-center justify-end gap-1">
          {hasUpdatePermission?.success ? (
            <Menu>
              <MenuTrigger
                aria-label="Change member role"
                className={cn(
                  buttonVariants({ size: "icon", variant: "ghost" }),
                  "size-8"
                )}
                disabled={isUpdatingRole}
                render={<button type="button" />}
              >
                {isUpdatingRole ? <Spinner /> : <Pencil className="size-4" />}
              </MenuTrigger>
              <MenuPopup align="end">
                {assignableRoles.map((role) => (
                  <MenuItem
                    key={role}
                    disabled={member.role === role}
                    onClick={() =>
                      updateMemberRole(
                        {
                          memberId: member.id,
                          role,
                        },
                        {
                          onSuccess: () => {
                            toastManager.add({
                              title: "Member role updated",
                              type: "success",
                            })
                          },
                        }
                      )
                    }
                  >
                    {formatRole(role)}
                  </MenuItem>
                ))}
              </MenuPopup>
            </Menu>
          ) : null}

          {isCurrentUser ? (
            <Button
              aria-label="Leave workspace"
              onClick={() => setLeaveOpen(true)}
              size="icon"
              type="button"
              variant="destructive-outline"
            >
              <LogOut className="size-4" />
            </Button>
          ) : null}
          {!isCurrentUser && hasDeletePermission?.success ? (
            <Button
              aria-label="Remove member"
              onClick={() => setRemoveOpen(true)}
              size="icon"
              type="button"
              variant="destructive-outline"
            >
              <Trash2 className="size-4" />
            </Button>
          ) : null}
        </div>

        {isCurrentUser && activeOrganization ? (
          <LeaveOrganizationDialog
            onOpenChange={setLeaveOpen}
            open={leaveOpen}
            organization={activeOrganization}
          />
        ) : null}
        {!isCurrentUser && hasDeletePermission?.success ? (
          <RemoveMemberDialog
            member={member}
            onOpenChange={setRemoveOpen}
            open={removeOpen}
          />
        ) : null}
      </TableCell>
    </TableRow>
  )
}
