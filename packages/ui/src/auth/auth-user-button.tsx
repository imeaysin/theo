"use client"

import { useAuthUiConfig, useAuthSession } from "@workspace/auth/react"
import type { LucideIcon } from "lucide-react"
import { ChevronsUpDown, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@workspace/ui/components/menu"
import { cn } from "@workspace/ui/lib/utils"
import { AuthUserAvatar, type AuthUserAvatarUser } from "./auth-user-avatar"
import { AuthUserView } from "./auth-user-view"
import { OrganizationSwitcherMenu } from "./organization/organization-switcher-menu"

export interface AuthUserButtonMenuItem {
  label: string
  href?: string
  icon?: LucideIcon
  onClick?: () => void
  variant?: "default" | "destructive"
}

export interface AuthUserButtonProps {
  className?: string
  size?: "icon" | "default" | "compact" | "sidebar"
  align?: "start" | "center" | "end"
  menuItems?: AuthUserButtonMenuItem[]
  hideSettings?: boolean
  showWorkspaceMenu?: boolean
  onSignOut?: () => void
  onCreateOrganization?: () => void
}

function getTriggerClassName(
  size: AuthUserButtonProps["size"],
  className?: string
) {
  if (size === "sidebar") {
    return cn(
      "flex min-h-8 w-full min-w-0 cursor-pointer appearance-none items-center gap-2 overflow-hidden rounded-lg px-2 py-1.5 text-left text-sm font-medium text-sidebar-foreground ring-sidebar-ring transition outline-none",
      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      "focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
      "in-data-[collapsed]:size-8 in-data-[collapsed]:w-8 in-data-[collapsed]:shrink-0 in-data-[collapsed]:justify-center in-data-[collapsed]:gap-0 in-data-[collapsed]:p-2",
      className
    )
  }

  if (size === "icon") {
    return cn("rounded-full", className)
  }

  return cn(
    buttonVariants({
      variant: "ghost",
      size: size === "compact" ? "sm" : "lg",
    }),
    "inline-flex h-auto max-w-full items-center font-normal",
    size === "compact" ? "gap-1 py-1" : "py-2.5",
    className
  )
}

function TriggerContent({
  isPending,
  size,
  user,
}: {
  isPending: boolean
  size: AuthUserButtonProps["size"]
  user: AuthUserAvatarUser | null
}) {
  if (size === "sidebar") {
    return (
      <>
        <AuthUserView
          className="min-w-0 flex-1 in-data-[collapsed]:hidden"
          loading={isPending}
          user={user}
        />
        <AuthUserAvatar
          className="hidden size-6 shrink-0 rounded-lg in-data-[collapsed]:flex"
          loading={isPending}
          user={user}
        />
        <ChevronsUpDown className="ml-auto size-4 shrink-0 text-sidebar-foreground/60 in-data-[collapsed]:hidden" />
      </>
    )
  }

  if (size === "icon") {
    return <AuthUserAvatar loading={isPending} user={user} />
  }

  return (
    <>
      <AuthUserView
        className="min-w-0 flex-1"
        loading={isPending}
        user={user}
      />
      <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
    </>
  )
}

export function AuthUserButton({
  className,
  size = "default",
  align = "end",
  menuItems = [],
  hideSettings = false,
  showWorkspaceMenu = false,
  onSignOut,
  onCreateOrganization,
}: AuthUserButtonProps) {
  const config = useAuthUiConfig()
  const { data: session, isPending } = useAuthSession()
  const [open, setOpen] = useState(false)
  const { Link } = config

  const user = session?.user ?? null

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut()
      return
    }
    config.navigate(config.routes.signOut)
  }

  const isIconOnly = size === "icon"
  const isSidebar = size === "sidebar"
  const triggerLabel = user?.name ?? user?.email ?? "Account menu"
  const hasAccountSection = menuItems.length > 0 || !hideSettings

  return (
    <Menu onOpenChange={setOpen} open={open}>
      <MenuTrigger
        aria-label={isIconOnly ? "Account menu" : triggerLabel}
        className={getTriggerClassName(size, className)}
        disabled={isPending && !user}
        render={<button type="button" />}
      >
        <TriggerContent isPending={isPending} size={size} user={user} />
      </MenuTrigger>

      <MenuPopup
        align={isSidebar ? "start" : align}
        className={cn("min-w-56", showWorkspaceMenu && "min-w-64")}
      >
        {user ? (
          <>
            {showWorkspaceMenu ? (
              <OrganizationSwitcherMenu
                hideHeader
                hidePersonal
                onClose={() => setOpen(false)}
                onCreateOrganization={onCreateOrganization}
              />
            ) : (
              <>
                <MenuGroup>
                  <MenuGroupLabel className="p-0 font-normal">
                    <AuthUserView className="px-2 py-1.5" user={user} />
                  </MenuGroupLabel>
                </MenuGroup>

                <MenuSeparator className="my-1.5" />
              </>
            )}

            {showWorkspaceMenu && hasAccountSection ? (
              <MenuSeparator className="my-1.5" />
            ) : null}

            {menuItems.map((item) => {
              const Icon = item.icon
              const content = (
                <>
                  {Icon ? <Icon className="text-muted-foreground" /> : null}
                  {item.label}
                </>
              )

              if (item.href) {
                return (
                  <MenuItem
                    key={item.label}
                    render={
                      <Link
                        className="flex w-full items-center gap-2"
                        to={item.href}
                      />
                    }
                    variant={item.variant}
                  >
                    {content}
                  </MenuItem>
                )
              }

              return (
                <MenuItem
                  key={item.label}
                  onClick={item.onClick}
                  variant={item.variant}
                >
                  {content}
                </MenuItem>
              )
            })}

            {!hideSettings ? (
              <MenuItem
                onClick={() => config.navigate(config.routes.settingsAccount)}
              >
                <Settings className="text-muted-foreground" />
                Account settings
              </MenuItem>
            ) : null}

            <MenuSeparator className="my-1.5" />

            <MenuItem onClick={handleSignOut}>
              <LogOut className="text-muted-foreground" />
              Sign out
            </MenuItem>
          </>
        ) : null}
      </MenuPopup>
    </Menu>
  )
}
