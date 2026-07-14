"use client"

import { useAuthenticate, usePlatformPermission } from "@workspace/auth/react"
import type { PlatformRoleName } from "@workspace/auth/types"
import { cn } from "@workspace/ui/lib/utils"
import type { AdminUsersProps } from "./admin-users"
import { AdminUsers } from "./admin-users"
import { platformUiPermissions } from "./ui-permissions"

export type AdminProps = {
  className?: string
  users: Omit<AdminUsersProps, "roles" | "formatRoleLabel"> & {
    roles: readonly PlatformRoleName[]
    formatRoleLabel: (role: PlatformRoleName) => string
  }
}

export function Admin({ className, users }: AdminProps) {
  useAuthenticate()
  const { data: canList, isPending } = usePlatformPermission(
    platformUiPermissions.listUsers
  )

  if (isPending) {
    return (
      <div
        className={cn("h-48 animate-pulse rounded-xl bg-muted", className)}
      />
    )
  }

  if (!canList?.success) {
    return (
      <div
        className={cn(
          "rounded-xl border p-6 text-sm text-muted-foreground",
          className
        )}
      >
        You do not have permission to access platform administration.
      </div>
    )
  }

  return (
    <div className={className}>
      <AdminUsers {...users} />
    </div>
  )
}
