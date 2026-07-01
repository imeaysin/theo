"use client"

import { useActiveOrganization } from "@workspace/auth/react"
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
import { OrganizationInvitationRow } from "./organization-invitation-row"

export interface OrganizationInvitationsProps {
  className?: string
}

export function OrganizationInvitations({
  className,
}: OrganizationInvitationsProps) {
  const { data: activeOrganization, isPending } = useActiveOrganization()
  const invitationList = activeOrganization?.invitations ?? []

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h3 className="truncate text-sm font-semibold">Invitations</h3>

      <Card className="p-0">
        <Table aria-label="Workspace invitations" variant="card">
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Invited</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="h-8 animate-pulse rounded-md bg-muted" />
                </TableCell>
              </TableRow>
            ) : null}
            {!isPending && invitationList.length === 0 ? (
              <TableRow>
                <TableCell
                  className="py-8 text-center text-muted-foreground"
                  colSpan={5}
                >
                  No pending invitations.
                </TableCell>
              </TableRow>
            ) : null}
            {!isPending
              ? invitationList.map((invitation) => (
                  <OrganizationInvitationRow
                    key={invitation.id}
                    invitation={invitation}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
