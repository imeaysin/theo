"use client"

import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth,
  useAuthPlugin,
  useHasPermission,
  useListOrganizationMembers,
  useSession,
} from "@better-auth-ui/react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui-shadcn/components/empty"
import { Badge } from "@workspace/ui-shadcn/components/badge"
import { Button, buttonVariants } from "@workspace/ui-shadcn/components/button"
import { DataTable } from "@workspace/ui-shadcn/components/data-table"
import { DataTableSkeleton } from "@workspace/ui-shadcn/components/data-table-skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui-shadcn/components/dropdown-menu"
import { Filter, Users, X } from "lucide-react"
import { type ComponentProps, useMemo, useState } from "react"

import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { cn } from "@workspace/ui-shadcn/lib/utils"
import { SectionHeader } from "@/components/page-header"
import { InviteMemberDialog } from "@/features/auth/components/organization/invite-member-dialog"
import {
  getOrganizationMembersColumns,
  matchesOrganizationMemberSearch,
} from "@/features/auth/components/organization/organization-members-columns"

/** Props for the `OrganizationMembers` component. */
export type OrganizationMembersProps = {
  className?: string
  hideInvite?: boolean
}

/**
 * Organization members list with filters and per-row actions.
 */
export function OrganizationMembers({
  className,
  hideInvite,
  ...props
}: OrganizationMembersProps & ComponentProps<"div">) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization, roles } =
    useAuthPlugin(organizationPlugin)

  const { data: session } = useSession(authClient)
  const { data: activeOrganization, isPending: activeOrganizationPending } =
    useActiveOrganization(authClient as OrganizationAuthClient)
  const { data: membersData, isPending: membersPending } =
    useListOrganizationMembers(authClient as OrganizationAuthClient)

  const { isPending: updatePermissionPending } = useHasPermission(
    authClient as OrganizationAuthClient,
    {
      permissions: { member: ["update"] },
    }
  )
  const { isPending: deletePermissionPending } = useHasPermission(
    authClient as OrganizationAuthClient,
    {
      permissions: { member: ["delete"] },
    }
  )

  const isPending =
    activeOrganizationPending ||
    membersPending ||
    updatePermissionPending ||
    deletePermissionPending

  const [roleFilter, setRoleFilter] = useState("all")
  const [inviteOpen, setInviteOpen] = useState(false)

  const members = useMemo(() => {
    const items = membersData?.members ?? []
    if (roleFilter === "all") return items
    return items.filter((member) => member.role === roleFilter)
  }, [membersData?.members, roleFilter])

  const isOwner = membersData?.members.some(
    (member) => member.role === "owner" && member.userId === session?.user.id
  )

  const columns = useMemo(() => {
    if (!activeOrganization) return []
    return getOrganizationMembersColumns({
      isOwner,
      organization: activeOrganization,
      roleLabels: roles,
    })
  }, [activeOrganization, isOwner, roles])

  const hasMembers = (membersData?.members.length ?? 0) > 0
  const showEmptyInitial = !isPending && !hasMembers

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <SectionHeader
        actions={
          !hideInvite ? (
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => setInviteOpen(true)}
            >
              {organizationLocalization.inviteMember}
            </Button>
          ) : null
        }
        title={organizationLocalization.members}
      />

      {isPending ? <DataTableSkeleton columnCount={3} /> : null}

      {showEmptyInitial ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>{organizationLocalization.members}</EmptyTitle>
            <EmptyDescription>
              Invite teammates to collaborate in this organization.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}

      {!isPending && activeOrganization && hasMembers ? (
        <DataTable
          columns={columns}
          data={members}
          filterFn={matchesOrganizationMemberSearch}
          filterPlaceholder={organizationLocalization.search}
          getRowId={(member) => member.id}
          initialSorting={[{ id: "user", desc: false }]}
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
                    {Object.entries(roles).map(([role, label]) => (
                      <DropdownMenuRadioItem key={role} value={role}>
                        {label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {roleFilter !== "all" ? (
                <Badge variant="secondary" className="w-fit gap-1">
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
            </div>
          }
        />
      ) : null}

      {!hideInvite ? (
        <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      ) : null}
    </div>
  )
}
