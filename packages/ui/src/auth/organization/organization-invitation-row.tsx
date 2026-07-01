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
import { TableCell, TableRow } from "@workspace/ui/components/table"
import { organizationUiPermissions } from "./ui-permissions"

export interface OrganizationInvitationRowProps {
  invitation: OrganizationInvitation
}

const invitationStatusVariant = {
  pending: "warning",
  accepted: "success",
  rejected: "error",
  canceled: "secondary",
} as const

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

  const statusVariant =
    invitationStatusVariant[
      invitation.status as keyof typeof invitationStatusVariant
    ] ?? "secondary"

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
        <Badge variant={statusVariant}>{invitation.status}</Badge>
      </TableCell>
      <TableCell className="text-end">
        {cancelPermission?.success && invitation.status === "pending" ? (
          <Button
            aria-label="Cancel invitation"
            disabled={cancelPending}
            loading={cancelPending}
            onClick={() => cancelInvitation({ invitationId: invitation.id })}
            size="icon"
            variant="destructive-outline"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </TableCell>
    </TableRow>
  )
}
