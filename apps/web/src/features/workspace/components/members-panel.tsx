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
import { UserMinusIcon, UserCogIcon } from "lucide-react"
import { formatRoleLabel } from "@/features/workspace/lib/org-roles"
import type { WorkspaceMember } from "@/features/workspace/hooks/use-workspace"

type MembersPanelProps = {
  readonly members: readonly WorkspaceMember[]
  readonly currentUserId: string
  readonly canAssignRoles: boolean
  readonly canRemoveMembers: boolean
  readonly onAssignRole: (member: WorkspaceMember) => void
  readonly onRemoveMember: (member: WorkspaceMember) => void
}

export function MembersPanel({
  members,
  currentUserId,
  canAssignRoles,
  canRemoveMembers,
  onAssignRole,
  onRemoveMember,
}: MembersPanelProps) {
  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No members in this workspace.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="w-28 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => {
          const isSelf = member.userId === currentUserId
          return (
            <TableRow key={member.id}>
              <TableCell>
                <div className="grid gap-0.5">
                  <span className="font-medium">
                    {member.user.name}
                    {isSelf ? (
                      <Badge className="ml-2" variant="secondary">
                        You
                      </Badge>
                    ) : null}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {member.user.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{formatRoleLabel(member.role)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {!isSelf && (canAssignRoles || canRemoveMembers) ? (
                  <div className="flex justify-end gap-1">
                    {canAssignRoles ? (
                      <Button
                        aria-label={`Change role for ${member.user.name}`}
                        onClick={() => onAssignRole(member)}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <UserCogIcon />
                      </Button>
                    ) : null}
                    {canRemoveMembers ? (
                      <Button
                        aria-label={`Remove ${member.user.name}`}
                        onClick={() => onRemoveMember(member)}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <UserMinusIcon />
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
