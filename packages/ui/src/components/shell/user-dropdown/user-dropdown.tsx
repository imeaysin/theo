"use client"

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import type React from "react"
import { useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Menu, MenuPopup, MenuTrigger } from "@workspace/ui/components/menu"
import { cn } from "@workspace/ui/lib/utils"
import { useShell } from "../shell-context"
import type { ShellUser, UserMenuItem } from "../types"
import { getUserInitials, UserMenuItemsList } from "../user-menu-content"

type UserDropdownPlacement = "topnav" | "sidebar" | "default"

const PLACEMENT_STYLES = {
  topnav: {
    avatarSize: "size-8",
    statusDot: "-right-0.5 -bottom-0.5 size-2.5",
    statusBorder: "border-border",
    fallbackText: "text-xs",
    triggerHover: "hover:bg-accent",
    nameText: "text-foreground",
    chevronText: "text-muted-foreground",
  },
  sidebar: {
    avatarSize: "size-6",
    statusDot: "-right-0.5 -bottom-0.5 size-2",
    statusBorder: "border-sidebar-border",
    fallbackText: "text-[10px]",
    triggerHover: "hover:bg-sidebar-accent",
    nameText: "text-sidebar-foreground",
    chevronText: "text-sidebar-foreground/60",
  },
  default: {
    avatarSize: "size-8",
    statusDot: "-right-0.5 -bottom-0.5 size-2.5",
    statusBorder: "border-sidebar-border",
    fallbackText: "text-xs",
    triggerHover: "hover:bg-sidebar-accent",
    nameText: "text-sidebar-foreground",
    chevronText: "text-sidebar-foreground/60",
  },
} as const

function resolvePlacementStyles(
  placement: UserDropdownPlacement,
  small?: boolean
) {
  if (placement === "topnav") {
    return PLACEMENT_STYLES.topnav
  }
  if (placement === "sidebar" && small) {
    return PLACEMENT_STYLES.sidebar
  }
  return PLACEMENT_STYLES.default
}

export interface UserDropdownProps {
  user?: ShellUser | null
  loading?: boolean
  onSignOut?: () => void
  menuItems?: UserMenuItem[]
  signOutLabel?: string
  small?: boolean
  placement?: UserDropdownPlacement
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
  const styles = resolvePlacementStyles(placement, small)

  if (!user && !loading) return null

  const name = user?.name ?? "User"
  const avatarAlt = user?.name ? `${user.name} avatar` : "User avatar"
  const ChevronIcon = menuOpen ? ChevronUpIcon : ChevronDownIcon

  return (
    <Menu onOpenChange={setMenuOpen} open={menuOpen}>
      <MenuTrigger
        disabled={loading}
        render={
          <button
            className={cn(
              "mx-0 flex cursor-pointer appearance-none items-center rounded-full text-left transition outline-none focus:ring-0 focus:outline-none md:rounded-none lg:rounded",
              styles.triggerHover,
              small ? "shrink-0 p-2" : "w-full px-2 py-1.5"
            )}
            data-testid="user-dropdown-trigger-button"
            type="button"
          />
        }
      >
        <span
          className={cn("relative shrink-0 rounded-full", !small && "mr-2")}
        >
          <Avatar className={cn("overflow-hidden", styles.avatarSize)}>
            <AvatarImage alt={avatarAlt} src={user?.avatarUrl ?? undefined} />
            <AvatarFallback className={styles.fallbackText}>
              {getUserInitials(name)}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute rounded-full border bg-success",
              styles.statusBorder,
              styles.statusDot
            )}
          />
        </span>
        {!small && (
          <span className="flex min-w-0 grow items-center gap-2">
            <span className="min-w-0 flex-1 text-sm leading-none">
              <span
                className={cn(
                  "block truncate py-0.5 leading-normal font-medium",
                  styles.nameText
                )}
              >
                {loading ? "Loading..." : name}
              </span>
            </span>
            <ChevronIcon
              aria-hidden="true"
              className={cn("size-4 shrink-0", styles.chevronText)}
            />
          </span>
        )}
      </MenuTrigger>

      <MenuPopup align="start" className="min-w-56">
        <UserMenuItemsList
          linkComponent={Link}
          menuItems={menuItems}
          onSignOut={onSignOut}
          signOutLabel={signOutLabel}
        />
      </MenuPopup>
    </Menu>
  )
}
