"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Invitation } from "better-auth/client"

import { Badge } from "@workspace/ui-shadcn/components/badge"
import { DataTableColumnHeader } from "@workspace/ui-shadcn/components/data-table-column-header"
import { OrganizationInvitationActions } from "@/features/auth/components/organization/organization-invitation-actions"

type OrganizationInvitationsColumnsOptions = {
  roleLabels: Record<string, string>
  statusLabels: Record<string, string>
}

export function getOrganizationInvitationsColumns({
  roleLabels,
  statusLabels,
}: OrganizationInvitationsColumnsOptions): ColumnDef<Invitation>[] {
  return [
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("email")}</div>
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
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "rejected" ? "destructive" : "secondary"
          }
        >
          {statusLabels[row.original.status] ?? row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Invited" />
      ),
      cell: ({ row }) => (
        <time className="whitespace-nowrap text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </time>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <OrganizationInvitationActions invitation={row.original} />
      ),
    },
  ]
}

export function matchesOrganizationInvitationSearch(
  invitation: Invitation,
  query: string
) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return invitation.email.toLowerCase().includes(normalized)
}
