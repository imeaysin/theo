"use client"

import {
  ChevronDownIcon,
  ChevronUpIcon,
  LogOutIcon,
} from "lucide-react"
import type React from "react"
import { useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@workspace/ui/components/menu"
import { cn } from "@workspace/ui/lib/utils"
import { useShell } from "../shell-context"
import type { ShellUser, UserMenuItem } from "../types"

function getInitials(name?: string | null): string {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/)
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
  return initials.toUpperCase() || "U"
}

export interface UserDropdownProps {
  user?: ShellUser | null
  loading?: boolean
  onSignOut?: () => void
  menuItems?: UserMenuItem[]
  signOutLabel?: string
  small?: boolean
  /** Where the trigger is rendered — affects avatar size and padding. */
  placement?: "topnav" | "sidebar" | "default"
}

export function UserDropdown({
  user,
  loading = false,
  onSignOut,
  menuItems = [],
  signOutLabel = "Sign out",
  small,
  placement = "default",
}: UserDropdownProps): React.ReactElement | null {
  const { Link } = useShell()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!user && !loading) return null

  const name = user?.name ?? "User"
  const avatarAlt = user?.name ? `${user.name} avatar` : "User avatar"

  const avatarSizeClass =
    placement === "topnav"
      ? "size-8"
      : small
        ? "size-6"
        : "size-8"

  const statusDotClass =
    placement === "topnav"
      ? "-right-0.5 -bottom-0.5 h-2.5 w-2.5"
      : small
        ? "-right-0.5 -bottom-0.5 h-2 w-2"
        : "-right-0.5 -bottom-0.5 h-2.5 w-2.5"

  return (
    <Menu onOpenChange={setMenuOpen} open={menuOpen}>
      <MenuTrigger
        disabled={loading}
        render={
          <button
            className={cn(
              "group mx-0 flex cursor-pointer appearance-none items-center rounded-full text-left outline-none transition hover:bg-sidebar-accent focus:outline-none focus:ring-0 md:rounded-none lg:rounded",
              small
                ? "shrink-0 p-2"
                : "w-full px-2 py-1.5"
            )}
            data-testid="user-dropdown-trigger-button"
            type="button"
          />
        }
      >
        <span
          className={cn(
            "relative shrink-0 rounded-full",
            !small && "mr-2"
          )}
        >
          <Avatar className={cn("overflow-hidden", avatarSizeClass)}>
            <AvatarImage
              alt={avatarAlt}
              src={user?.avatarUrl ?? undefined}
            />
            <AvatarFallback
              className={cn(
                placement === "topnav"
                  ? "text-xs"
                  : small
                    ? "text-[10px]"
                    : "text-xs"
              )}
            >
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute rounded-full border border-sidebar-border bg-green-500",
              statusDotClass
            )}
          />
        </span>
        {!small && (
          <span className="flex grow items-center gap-2">
            <span className="w-24 shrink-0 text-sm leading-none">
              <span className="block truncate py-0.5 font-medium leading-normal text-sidebar-accent-foreground">
                {loading ? "Loading..." : name}
              </span>
            </span>
            {menuOpen ? (
              <ChevronUpIcon
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-muted-foreground"
              />
            ) : (
              <ChevronDownIcon
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-muted-foreground"
              />
            )}
          </span>
        )}
      </MenuTrigger>

      <MenuPopup align="start" className="min-w-56">
        {menuItems.map((menuItem) => {
          const Icon = menuItem.icon
          const content = (
            <>
              {Icon ? <Icon /> : null}
              {menuItem.label}
            </>
          )

          return (
            <div key={menuItem.label}>
              {menuItem.separatorBefore ? <MenuSeparator /> : null}
              {menuItem.href ? (
                <MenuItem
                  render={
                    <Link
                      href={menuItem.href}
                      rel={menuItem.rel}
                      target={menuItem.target}
                    />
                  }
                  variant={menuItem.variant}
                >
                  {content}
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={menuItem.onClick}
                  variant={menuItem.variant}
                >
                  {content}
                </MenuItem>
              )}
            </div>
          )
        })}

        {onSignOut ? (
          <>
            {menuItems.length > 0 ? <MenuSeparator /> : null}
            <MenuItem onClick={onSignOut} variant="destructive">
              <LogOutIcon />
              {signOutLabel}
            </MenuItem>
          </>
        ) : null}
      </MenuPopup>
    </Menu>
  )
}
