"use client"

import {
  type OrganizationAuthClient,
  useAcceptInvitation,
  useAuth,
  useAuthPlugin,
  useListUserInvitations,
  useRejectInvitation,
} from "@better-auth-ui/react"
import type { Invitation } from "better-auth/client"
import type { ColumnDef } from "@tanstack/react-table"
import { Check, X } from "lucide-react"
import { useMemo } from "react"

import { Badge } from "@workspace/ui-shadcn/components/badge"
import { Button } from "@workspace/ui-shadcn/components/button"
import { DataTable } from "@workspace/ui-shadcn/components/data-table"
import { DataTableColumnHeader } from "@workspace/ui-shadcn/components/data-table-column-header"
import { DataTableSkeleton } from "@workspace/ui-shadcn/components/data-table-skeleton"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { SectionHeader } from "@/components/page-header"
import { UserInvitationsEmpty } from "@/features/auth/components/organization/user-invitations-empty"

type UserInvitation = Invitation & { organizationName?: string }

function UserInvitationActions({ invitation }: { invitation: UserInvitation }) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { mutate: acceptInvitation, isPending: isAccepting } =
    useAcceptInvitation(authClient as OrganizationAuthClient)

  const { mutate: rejectInvitation, isPending: isRejecting } =
    useRejectInvitation(authClient as OrganizationAuthClient)

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={isAccepting || isRejecting}
        onClick={() => acceptInvitation({ invitationId: invitation.id })}
      >
        {isAccepting ? <Spinner data-icon="inline-start" /> : null}
        {!isAccepting ? <Check data-icon="inline-start" /> : null}
        {organizationLocalization.accept}
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        className="text-destructive"
        disabled={isAccepting || isRejecting}
        onClick={() => rejectInvitation({ invitationId: invitation.id })}
        aria-label={organizationLocalization.rejectInvitation}
      >
        {isRejecting ? <Spinner /> : <X />}
      </Button>
    </div>
  )
}

function getUserInvitationsColumns(
  roleLabels: Record<string, string>
): ColumnDef<UserInvitation>[] {
  return [
    {
      id: "organization",
      accessorFn: (row) => row.organizationName ?? "",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Organization" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.organizationName}</div>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {roleLabels[row.original.role] ?? row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Received" />
      ),
      cell: ({ row }) => (
        <time className="whitespace-nowrap text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </time>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => <UserInvitationActions invitation={row.original} />,
    },
  ]
}

export type UserInvitationsProps = {
  className?: string
}

/**
 * Organization invitations for the signed-in user.
 */
export function UserInvitations({ className }: UserInvitationsProps) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization, roles } =
    useAuthPlugin(organizationPlugin)

  const { data: invitations, isPending } = useListUserInvitations(
    authClient as OrganizationAuthClient
  )

  const columns = useMemo(() => getUserInvitationsColumns(roles), [roles])
  const hasInvitations = (invitations?.length ?? 0) > 0

  return (
    <div className={className}>
      <div className="flex flex-col gap-3">
        <SectionHeader title={organizationLocalization.invitations} />

        {isPending ? (
          <DataTableSkeleton columnCount={4} withToolbar={false} />
        ) : null}

        {!isPending && !hasInvitations ? <UserInvitationsEmpty /> : null}

        {!isPending && hasInvitations ? (
          <DataTable
            columns={columns}
            data={invitations ?? []}
            filterColumn="organization"
            filterPlaceholder="Filter invitations..."
            getRowId={(invitation) => invitation.id}
            initialSorting={[{ id: "createdAt", desc: true }]}
          />
        ) : null}
      </div>
    </div>
  )
}
