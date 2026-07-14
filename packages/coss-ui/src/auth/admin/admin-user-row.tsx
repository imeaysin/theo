"use client"

import {
  useAuthSession,
  useImpersonateUser,
  usePlatformPermission,
  useSetUserRole,
  useUnbanUser,
  type AdminListedUser,
} from "@workspace/auth/react"
import type { PlatformRoleName } from "@workspace/auth/types"
import { Badge } from "@workspace/ui/components/badge"
import { LogIn, Pencil, ShieldOff } from "lucide-react"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@workspace/ui/components/menu"
import { Spinner } from "@workspace/ui/components/spinner"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import { toastManager } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import { AuthUserView } from "../auth-user-view"
import { platformUiPermissions } from "./ui-permissions"

export type AdminUserRowProps = {
  user: AdminListedUser
  roles: readonly PlatformRoleName[]
  formatRoleLabel: (role: PlatformRoleName) => string
  onBanClick: (user: AdminListedUser) => void
}

export function AdminUserRow({
  user,
  roles,
  formatRoleLabel,
  onBanClick,
}: AdminUserRowProps) {
  const { data: session } = useAuthSession()
  const { data: canSetRole, isPending: setRolePermissionPending } =
    usePlatformPermission(platformUiPermissions.setRole)
  const { data: canBan, isPending: banPermissionPending } =
    usePlatformPermission(platformUiPermissions.banUser)
  const { data: canImpersonate, isPending: impersonatePermissionPending } =
    usePlatformPermission(platformUiPermissions.impersonateUser)

  const { mutate: setUserRole, isPending: isUpdatingRole } = useSetUserRole()
  const { mutate: unbanUser, isPending: isUnbanning } = useUnbanUser()
  const { mutate: impersonateUser, isPending: isImpersonating } =
    useImpersonateUser()

  const isPending =
    setRolePermissionPending ||
    banPermissionPending ||
    impersonatePermissionPending
  const isCurrentUser = session?.user.id === user.id
  const currentRole = user.role ?? "user"
  const isBanned = !!user.banned

  if (isPending) {
    return (
      <TableRow>
        <TableCell colSpan={4}>
          <div className="h-8 animate-pulse rounded-md bg-muted" />
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell>
        <AuthUserView user={user} />
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap items-center gap-2">
          <span>{formatRoleLabel(currentRole)}</span>
          {isBanned ? <Badge variant="destructive">Banned</Badge> : null}
        </div>
      </TableCell>

      <TableCell className="max-w-xs truncate text-muted-foreground">
        {user.banReason ?? "—"}
      </TableCell>

      <TableCell>
        <div className="flex items-center justify-end gap-1">
          {canSetRole?.success && !isCurrentUser ? (
            <Menu>
              <MenuTrigger
                aria-label="Change platform role"
                className={cn(
                  buttonVariants({ size: "icon", variant: "ghost" }),
                  "size-8"
                )}
                disabled={isUpdatingRole}
                render={<button type="button" />}
              >
                {isUpdatingRole ? <Spinner /> : <Pencil className="size-4" />}
              </MenuTrigger>
              <MenuPopup align="end">
                {roles.map((role) => (
                  <MenuItem
                    key={role}
                    disabled={currentRole === role}
                    onClick={() =>
                      setUserRole(
                        { userId: user.id, role },
                        {
                          onSuccess: () => {
                            toastManager.add({
                              title: "Role updated",
                              description:
                                "The platform role has been updated.",
                              type: "success",
                            })
                          },
                          onError: () => {
                            toastManager.add({
                              title: "Could not update role",
                              description: "Please try again.",
                              type: "error",
                            })
                          },
                        }
                      )
                    }
                  >
                    {formatRoleLabel(role)}
                  </MenuItem>
                ))}
              </MenuPopup>
            </Menu>
          ) : null}

          {canImpersonate?.success && !isCurrentUser && !isBanned ? (
            <Button
              aria-label="Impersonate user"
              disabled={isImpersonating}
              onClick={() =>
                impersonateUser(
                  { userId: user.id },
                  {
                    onSuccess: () => {
                      toastManager.add({
                        title: "Impersonation started",
                        description: "You are now signed in as this user.",
                        type: "success",
                      })
                    },
                    onError: () => {
                      toastManager.add({
                        title: "Could not impersonate user",
                        description: "Please try again.",
                        type: "error",
                      })
                    },
                  }
                )
              }
              size="icon"
              type="button"
              variant="ghost"
            >
              {isImpersonating ? <Spinner /> : <LogIn className="size-4" />}
            </Button>
          ) : null}

          {canBan?.success && !isCurrentUser && isBanned ? (
            <Button
              aria-label="Unban user"
              disabled={isUnbanning}
              onClick={() =>
                unbanUser(
                  { userId: user.id },
                  {
                    onSuccess: () => {
                      toastManager.add({
                        title: "User unbanned",
                        description: "The user can sign in again.",
                        type: "success",
                      })
                    },
                    onError: () => {
                      toastManager.add({
                        title: "Could not unban user",
                        description: "Please try again.",
                        type: "error",
                      })
                    },
                  }
                )
              }
              size="icon"
              type="button"
              variant="ghost"
            >
              {isUnbanning ? <Spinner /> : <ShieldOff className="size-4" />}
            </Button>
          ) : null}

          {canBan?.success && !isCurrentUser && !isBanned ? (
            <Button
              aria-label="Ban user"
              onClick={() => onBanClick(user)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ShieldOff className="size-4 text-destructive" />
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  )
}
