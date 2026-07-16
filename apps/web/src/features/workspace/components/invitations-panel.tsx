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
import { XIcon } from "lucide-react"
import { formatRoleLabel } from "@/features/workspace/lib/org-roles"
import type { WorkspaceInvitation } from "@/features/workspace/hooks/use-workspace"

type InvitationsPanelProps = {
  readonly invitations: readonly WorkspaceInvitation[]
  readonly canManageInvites: boolean
  readonly onCancel: (invitation: WorkspaceInvitation) => void
}

export function InvitationsPanel({
  invitations,
  canManageInvites,
  onCancel,
}: InvitationsPanelProps) {
  const pending = invitations.filter(
    (invite) => invite.status === "pending" || invite.status === "Pending"
  )

  if (pending.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No pending invitations.</p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-20 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pending.map((invite) => (
          <TableRow key={invite.id}>
            <TableCell className="font-medium">{invite.email}</TableCell>
            <TableCell>
              <Badge variant="outline">{formatRoleLabel(invite.role)}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{invite.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              {canManageInvites ? (
                <Button
                  aria-label={`Cancel invite to ${invite.email}`}
                  onClick={() => onCancel(invite)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <XIcon />
                </Button>
              ) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
