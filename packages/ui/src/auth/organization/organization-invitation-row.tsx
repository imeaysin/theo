"use client"

import {
  formatOrganizationRoleLabel,
  useCancelInvitation,
  useOrganizationPermission,
} from "@workspace/auth/react"
import type { OrganizationInvitation } from "@workspace/auth/types/organization"
import { X } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"
import { organizationUiPermissions } from "./ui-permissions"

export interface OrganizationInvitationRowProps {
  invitation: OrganizationInvitation
}

const statusBadgeClasses: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  accepted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "bg-destructive/10 text-destructive",
  canceled: "bg-muted text-muted-foreground",
}

export function OrganizationInvitationRow({
  invitation,
}: OrganizationInvitationRowProps) {
  const { data: cancelPermission, isPending: cancelPermissionPending } =
    useOrganizationPermission(organizationUiPermissions.cancelInvitation)
  const { mutate: cancelInvitation, isPending: cancelPending } =
    useCancelInvitation()

  if (cancelPermissionPending) {
    return (
      <TableRow>
        <TableCell colSpan={5}>
          <div className="h-8 animate-pulse rounded-md bg-muted" />
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell className="text-sm font-medium">{invitation.email}</TableCell>
      <TableCell className="text-xs whitespace-nowrap text-muted-foreground tabular-nums">
        {new Date(invitation.createdAt).toLocaleString(undefined, {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </TableCell>
      <TableCell className="text-sm">
        {formatOrganizationRoleLabel(invitation.role)}
      </TableCell>
      <TableCell className="text-sm">
        <Badge
          className={cn(statusBadgeClasses[invitation.status])}
          variant="secondary"
        >
          {invitation.status}
        </Badge>
      </TableCell>
      <TableCell className="text-end">
        {cancelPermission?.success && invitation.status === "pending" ? (
          <Button
            aria-label="Cancel invitation"
            className="size-8 text-destructive"
            disabled={cancelPending}
            onClick={() => cancelInvitation({ invitationId: invitation.id })}
            size="icon"
            variant="outline"
          >
            {cancelPending ? <Spinner /> : <X className="size-4" />}
          </Button>
        ) : null}
      </TableCell>
    </TableRow>
  )
}
