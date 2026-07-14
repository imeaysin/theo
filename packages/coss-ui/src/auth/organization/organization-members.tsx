"use client"

import {
  useActiveOrganization,
  useAssignableOrganizationRoles,
  useOrganizationPermission,
} from "@workspace/auth/react"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"
import type { InviteMemberDialogProps } from "./invite-member-dialog"
import { InviteMemberDialog } from "./invite-member-dialog"
import { OrganizationMemberRow } from "./organization-member-row"
import { organizationUiPermissions } from "./ui-permissions"

export type OrganizationMembersProps = {
  className?: string
  inviteDialog?: InviteMemberDialogProps
  onInviteClick?: () => void
}

export function OrganizationMembers({
  className,
  inviteDialog,
  onInviteClick,
}: OrganizationMembersProps) {
  const { data: activeOrganization, isPending } = useActiveOrganization()
  const { data: invitePermission } = useOrganizationPermission(
    organizationUiPermissions.inviteMember
  )
  const { roles: assignableRoles, formatOrganizationRoleLabel } =
    useAssignableOrganizationRoles()

  const members = activeOrganization?.members ?? []
  const canInvite = !!invitePermission?.success

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-end justify-between gap-3">
        <h3 className="truncate text-sm font-semibold">Members</h3>
        {canInvite && onInviteClick ? (
          <Button disabled={isPending} onClick={onInviteClick} size="sm">
            Invite member
          </Button>
        ) : null}
      </div>

      <Card className="p-0">
        <Table aria-label="Workspace members" variant="card">
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
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
            {!isPending && members.length === 0 ? (
              <TableRow>
                <TableCell
                  className="py-8 text-center text-muted-foreground"
                  colSpan={3}
                >
                  No members yet.
                </TableCell>
              </TableRow>
            ) : null}
            {!isPending
              ? members.map((member) => (
                  <OrganizationMemberRow
                    key={member.id}
                    assignableRoles={assignableRoles}
                    formatRoleLabel={formatOrganizationRoleLabel}
                    member={member}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </Card>

      {canInvite && inviteDialog ? (
        <InviteMemberDialog {...inviteDialog} />
      ) : null}
    </div>
  )
}
