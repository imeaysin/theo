"use client"

import {
  useListUsers,
  usePlatformPermission,
  type AdminListedUser,
  type AdminListUsersQuery,
} from "@workspace/auth/react"
import type { PlatformRoleName } from "@workspace/auth/types"
import { Button } from "@workspace/ui-shadcn/components/button"
import { Card } from "@workspace/ui-shadcn/components/card"
import { Input } from "@workspace/ui-shadcn/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui-shadcn/components/table"
import { cn } from "@workspace/ui-shadcn/lib/utils"
import { useEffect, useMemo, useState } from "react"
import type { CreateUserDialogProps } from "./create-user-dialog"
import { CreateUserDialog } from "./create-user-dialog"
import { AdminUserRow } from "./admin-user-row"
import { platformUiPermissions } from "./ui-permissions"

const PAGE_SIZE = 20

export type AdminUsersProps = {
  className?: string
  createDialog?: CreateUserDialogProps
  onCreateClick?: () => void
  onBanClick: (user: AdminListedUser) => void
  roles: readonly PlatformRoleName[]
  formatRoleLabel: (role: PlatformRoleName) => string
}

export function AdminUsers({
  className,
  createDialog,
  onCreateClick,
  onBanClick,
  roles,
  formatRoleLabel,
}: AdminUsersProps) {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(0)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const query = useMemo((): AdminListUsersQuery => {
    const base: AdminListUsersQuery = {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
      sortBy: "createdAt",
      sortDirection: "desc",
    }

    if (!debouncedSearch) return base

    return {
      ...base,
      searchValue: debouncedSearch,
      searchField: "email",
      searchOperator: "contains",
    }
  }, [debouncedSearch, page])

  const { data: listPermission } = usePlatformPermission(
    platformUiPermissions.listUsers
  )
  const { data: createPermission } = usePlatformPermission(
    platformUiPermissions.createUser
  )
  const { data, isPending, isFetching } = useListUsers(query, undefined, {
    enabled: !!listPermission?.success,
  })

  const users = data?.users ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const canCreate = !!createPermission?.success

  if (!listPermission?.success) {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        You do not have permission to view platform users.
      </Card>
    )
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="truncate text-sm font-semibold">Platform users</h3>
          <Input
            aria-label="Search users by email"
            className="max-w-sm"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by email"
            value={search}
          />
        </div>
        {canCreate && onCreateClick ? (
          <Button disabled={isPending} onClick={onCreateClick} size="sm">
            Create user
          </Button>
        ) : null}
      </div>

      <Card className="p-0">
        <Table aria-label="Platform users">
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Ban reason</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="h-8 animate-pulse rounded-md bg-muted" />
                </TableCell>
              </TableRow>
            ) : null}
            {!isPending && users.length === 0 ? (
              <TableRow>
                <TableCell
                  className="py-8 text-center text-muted-foreground"
                  colSpan={4}
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : null}
            {!isPending
              ? users.map((user) => (
                  <AdminUserRow
                    key={user.id}
                    formatRoleLabel={formatRoleLabel}
                    onBanClick={onBanClick}
                    roles={roles}
                    user={user}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          {total} user{total === 1 ? "" : "s"}
          {isFetching ? " · Updating…" : ""}
        </span>
        <div className="flex items-center gap-2">
          <Button
            disabled={page === 0 || isFetching}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            size="sm"
            type="button"
            variant="outline"
          >
            Previous
          </Button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <Button
            disabled={page + 1 >= totalPages || isFetching}
            onClick={() => setPage((current) => current + 1)}
            size="sm"
            type="button"
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>

      {canCreate && createDialog ? (
        <CreateUserDialog {...createDialog} />
      ) : null}
    </div>
  )
}
