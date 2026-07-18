"use client"

import type { OrganizationLocalization } from "@better-auth-ui/core/plugins"
import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useHasPermission,
  useListOrganizationInvitations,
} from "@better-auth-ui/react"
import { Filter, X } from "lucide-react"
import { type ComponentProps, useMemo, useState } from "react"

import { Badge } from "@workspace/ui-shadcn/components/badge"
import { buttonVariants } from "@workspace/ui-shadcn/components/button"
import { DataTable } from "@workspace/ui-shadcn/components/data-table"
import { DataTableSkeleton } from "@workspace/ui-shadcn/components/data-table-skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui-shadcn/components/dropdown-menu"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { cn } from "@workspace/ui-shadcn/lib/utils"
import { SectionHeader } from "@/components/page-header"
import { InviteMemberDialog } from "@/features/auth/components/organization/invite-member-dialog"
import {
  getOrganizationInvitationsColumns,
  matchesOrganizationInvitationSearch,
} from "@/features/auth/components/organization/organization-invitations-columns"
import { OrganizationInvitationsEmpty } from "@/features/auth/components/organization/organization-invitations-empty"

/** Props for the `OrganizationInvitations` component. */
export type OrganizationInvitationsProps = {
  className?: string
}

/**
 * Organization invitations list with filters and per-row actions.
 */
export function OrganizationInvitations({
  className,
  ...props
}: OrganizationInvitationsProps & ComponentProps<"div">) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization, roles } =
    useAuthPlugin(organizationPlugin)

  const { data: invitations, isPending: invitationsPending } =
    useListOrganizationInvitations(authClient as OrganizationAuthClient)

  const { isPending: invitationPermissionPending } = useHasPermission(
    authClient as OrganizationAuthClient,
    {
      permissions: { invitation: ["cancel"] },
    }
  )

  const isPending = invitationsPending || invitationPermissionPending

  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [inviteOpen, setInviteOpen] = useState(false)

  const filteredInvitations = useMemo(() => {
    return (invitations ?? []).filter(
      (invitation) =>
        (roleFilter === "all" || invitation.role === roleFilter) &&
        (statusFilter === "all" || invitation.status === statusFilter)
    )
  }, [invitations, roleFilter, statusFilter])

  const statusLabels = useMemo(() => {
    const statuses = ["pending", "accepted", "rejected", "canceled"] as const
    return Object.fromEntries(
      statuses.map((status) => [
        status,
        organizationLocalization[status as keyof OrganizationLocalization] ??
          status,
      ])
    ) as Record<string, string>
  }, [organizationLocalization])

  const columns = useMemo(
    () =>
      getOrganizationInvitationsColumns({
        roleLabels: roles,
        statusLabels,
      }),
    [roles, statusLabels]
  )

  const hasInvitations = (invitations?.length ?? 0) > 0
  const showEmptyInitial = !isPending && !hasInvitations

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <SectionHeader title={organizationLocalization.invitations} />

      {isPending ? <DataTableSkeleton columnCount={5} /> : null}

      {showEmptyInitial ? (
        <OrganizationInvitationsEmpty
          onInvitePress={() => setInviteOpen(true)}
        />
      ) : null}

      {!isPending && hasInvitations ? (
        <DataTable
          columns={columns}
          data={filteredInvitations}
          filterFn={matchesOrganizationInvitationSearch}
          filterPlaceholder={organizationLocalization.search}
          getRowId={(invitation) => invitation.id}
          initialSorting={[{ id: "createdAt", desc: true }]}
          toolbar={
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    buttonVariants({ size: "sm", variant: "outline" })
                  )}
                >
                  <Filter />
                  {organizationLocalization.role}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuRadioGroup
                    value={roleFilter}
                    onValueChange={setRoleFilter}
                  >
                    <DropdownMenuRadioItem value="all">
                      {organizationLocalization.all}
                    </DropdownMenuRadioItem>
                    {Object.entries(roles).map(([key, label]) => (
                      <DropdownMenuRadioItem key={key} value={key}>
                        {label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    buttonVariants({ size: "sm", variant: "outline" })
                  )}
                >
                  <Filter />
                  {organizationLocalization.status}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuRadioGroup
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <DropdownMenuRadioItem value="all">
                      {organizationLocalization.all}
                    </DropdownMenuRadioItem>
                    {(
                      ["pending", "accepted", "rejected", "canceled"] as const
                    ).map((status) => (
                      <DropdownMenuRadioItem key={status} value={status}>
                        {statusLabels[status]}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {roleFilter !== "all" || statusFilter !== "all" ? (
                <div className="flex flex-wrap gap-2">
                  {roleFilter !== "all" ? (
                    <Badge variant="secondary" className="gap-1">
                      {organizationLocalization.role}:{" "}
                      <span className="capitalize">
                        {roles?.[roleFilter] ?? roleFilter}
                      </span>
                      <button
                        type="button"
                        aria-label={organizationLocalization.clear}
                        className="inline-flex cursor-pointer items-center text-muted-foreground hover:text-foreground"
                        onClick={() => setRoleFilter("all")}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ) : null}
                  {statusFilter !== "all" ? (
                    <Badge variant="secondary" className="gap-1">
                      {organizationLocalization.status}:{" "}
                      {statusLabels[statusFilter]}
                      <button
                        type="button"
                        aria-label={organizationLocalization.clear}
                        className="inline-flex cursor-pointer items-center text-muted-foreground hover:text-foreground"
                        onClick={() => setStatusFilter("all")}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ) : null}
                </div>
              ) : null}
            </div>
          }
        />
      ) : null}

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}
