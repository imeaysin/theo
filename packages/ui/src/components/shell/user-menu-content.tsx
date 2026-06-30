"use client"

import { LogOutIcon } from "lucide-react"
import type React from "react"
import { MenuItem, MenuSeparator } from "@workspace/ui/components/menu"
import type { ShellLinkProps, UserMenuItem } from "./types"

export function getUserInitials(name?: string | null): string {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/)
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
  return initials.toUpperCase() || "U"
}

export function UserMenuItemsList({
  menuItems,
  onSignOut,
  signOutLabel = "Sign out",
  linkComponent: LinkComponent,
  iconClassName,
}: {
  menuItems: UserMenuItem[]
  onSignOut?: () => void
  signOutLabel?: string
  linkComponent: React.ComponentType<ShellLinkProps>
  iconClassName?: string
}): React.ReactElement {
  return (
    <>
      {menuItems.map((menuItem) => {
        const Icon = menuItem.icon
        const content = (
          <>
            {Icon ? <Icon className={iconClassName} /> : null}
            {menuItem.label}
          </>
        )

        return (
          <div key={menuItem.label}>
            {menuItem.separatorBefore ? <MenuSeparator /> : null}
            {menuItem.href ? (
              <MenuItem
                render={
                  <LinkComponent
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
              <MenuItem onClick={menuItem.onClick} variant={menuItem.variant}>
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
            <LogOutIcon className={iconClassName} />
            {signOutLabel}
          </MenuItem>
        </>
      ) : null}
    </>
  )
}
