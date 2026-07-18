"use client"

import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useHasPermission,
  useSession,
  useUpdateMemberRole,
} from "@better-auth-ui/react"
import type { Member, Organization, User } from "better-auth/client"
import { LogOut, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button, buttonVariants } from "@workspace/ui-shadcn/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui-shadcn/components/dropdown-menu"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { cn } from "@workspace/ui-shadcn/lib/utils"
import { LeaveOrganizationDialog } from "@/features/auth/components/organization/leave-organization-dialog"
import { RemoveMemberDialog } from "@/features/auth/components/organization/remove-member-dialog"

export type OrganizationMemberActionsProps = {
  member: Member & { user: Partial<User> }
  isOwner?: boolean
  organization: Organization
}

export function OrganizationMemberActions({
  member,
  isOwner,
  organization,
}: OrganizationMemberActionsProps) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization, roles } =
    useAuthPlugin(organizationPlugin)

  const { data: session } = useSession(authClient)

  const { data: hasUpdatePermission, isPending: updatePermissionPending } =
    useHasPermission(authClient as OrganizationAuthClient, {
      permissions: { member: ["update"] },
    })

  const { data: hasDeletePermission, isPending: deletePermissionPending } =
    useHasPermission(authClient as OrganizationAuthClient, {
      permissions: { member: ["delete"] },
    })

  const isPending = updatePermissionPending || deletePermissionPending

  const { mutate: updateMemberRole, isPending: isUpdatingRole } =
    useUpdateMemberRole(authClient as OrganizationAuthClient, {
      onSuccess: () =>
        toast.success(organizationLocalization.memberRoleUpdated),
    })

  const assignableRoles = Object.entries(roles).filter(
    ([key]) => isOwner || key !== "owner"
  )

  const isCurrentUser = session?.user.id === member.userId

  const [removeOpen, setRemoveOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)

  if (isPending) {
    return <Spinner className="size-4" />
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {hasUpdatePermission?.success ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ size: "icon-sm", variant: "outline" })
            )}
            disabled={isUpdatingRole}
            aria-label={organizationLocalization.changeMemberRole}
          >
            {isUpdatingRole ? <Spinner /> : <Pencil />}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {assignableRoles.map(([role, label]) => (
                <DropdownMenuItem
                  key={role}
                  disabled={member.role === role}
                  onClick={() =>
                    updateMemberRole({ memberId: member.id, role })
                  }
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}

      {isCurrentUser ? (
        <Button
          size="icon-sm"
          variant="outline"
          className="text-destructive"
          aria-label={organizationLocalization.leaveOrganization}
          onClick={() => setLeaveOpen(true)}
        >
          <LogOut />
        </Button>
      ) : null}

      {!isCurrentUser && hasDeletePermission?.success ? (
        <Button
          size="icon-sm"
          variant="outline"
          className="text-destructive"
          aria-label={organizationLocalization.removeMember}
          onClick={() => setRemoveOpen(true)}
        >
          <Trash2 />
        </Button>
      ) : null}

      {isCurrentUser && organization ? (
        <LeaveOrganizationDialog
          open={leaveOpen}
          onOpenChange={setLeaveOpen}
          organization={organization}
        />
      ) : null}

      {!isCurrentUser && hasDeletePermission?.success ? (
        <RemoveMemberDialog
          open={removeOpen}
          onOpenChange={setRemoveOpen}
          member={member}
        />
      ) : null}
    </div>
  )
}
