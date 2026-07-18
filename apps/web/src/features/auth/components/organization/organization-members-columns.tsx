"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Member, Organization, User } from "better-auth/client"

import { Badge } from "@workspace/ui-shadcn/components/badge"
import { DataTableColumnHeader } from "@workspace/ui-shadcn/components/data-table-column-header"
import { UserView } from "@/features/auth/components/user/user-view"
import { OrganizationMemberActions } from "@/features/auth/components/organization/organization-member-actions"

export type OrganizationMember = Member & { user: Partial<User> }

type OrganizationMembersColumnsOptions = {
  isOwner?: boolean
  organization: Organization
  roleLabels: Record<string, string>
}

export function getOrganizationMembersColumns({
  isOwner,
  organization,
  roleLabels,
}: OrganizationMembersColumnsOptions): ColumnDef<OrganizationMember>[] {
  return [
    {
      id: "user",
      accessorFn: (row) => row.user.name || row.user.email || "",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Member" />
      ),
      cell: ({ row }) => <UserView user={row.original.user} />,
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
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <OrganizationMemberActions
          member={row.original}
          isOwner={isOwner}
          organization={organization}
        />
      ),
    },
  ]
}

export function matchesOrganizationMemberSearch(
  member: OrganizationMember,
  query: string
) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  return (
    (member.user.name?.toLowerCase().includes(normalized) ?? false) ||
    (member.user.email?.toLowerCase().includes(normalized) ?? false)
  )
}
