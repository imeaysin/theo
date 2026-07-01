"use client"

import {
  useActiveOrganization,
  useOrganizationPermissionByKey,
} from "@workspace/auth/react"
import type { ComponentProps } from "react"
import { useState } from "react"
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
import { InviteMemberDialog } from "./invite-member-dialog"
import { OrganizationMemberRow } from "./organization-member-row"

export interface OrganizationMembersProps {
  className?: string
}

export function OrganizationMembers({
  className,
  ...props
}: OrganizationMembersProps & ComponentProps<"div">) {
  const { data: activeOrganization, isPending } = useActiveOrganization()
  const { data: invitePermission } =
    useOrganizationPermissionByKey("inviteMember")
  const [inviteOpen, setInviteOpen] = useState(false)

  const members = activeOrganization?.members ?? []

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <div className="flex items-end justify-between gap-3">
        <h3 className="truncate text-sm font-semibold">Members</h3>
        {invitePermission?.success ? (
          <Button
            disabled={isPending}
            onClick={() => setInviteOpen(true)}
            size="sm"
          >
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
                  <OrganizationMemberRow key={member.id} member={member} />
                ))
              : null}
          </TableBody>
        </Table>
      </Card>

      <InviteMemberDialog onOpenChange={setInviteOpen} open={inviteOpen} />
    </div>
  )
}
