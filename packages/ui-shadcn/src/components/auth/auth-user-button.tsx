"use client"

import { useAuthUiConfig, useAuthSession } from "@workspace/auth/react"
import type { LucideIcon } from "lucide-react"
import { ChevronsUpDown, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import { buttonVariants } from "@workspace/ui-shadcn/components/button"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui-shadcn/components/dropdown-menu"
import { cn } from "@workspace/ui-shadcn/lib/utils"
import { AuthUserAvatar, type AuthUserAvatarUser } from "./auth-user-avatar"
import { AuthUserView } from "./auth-user-view"
import { OrganizationSwitcherMenu } from "./organization/organization-switcher-menu"

export type AuthUserButtonMenuItem = {
  label: string
  href?: string
  icon?: LucideIcon
  onClick?: () => void
  variant?: "default" | "destructive"
}

function renderAuthUserMenuItemContent(
  item: AuthUserButtonMenuItem,
  Icon?: LucideIcon
) {
  const destructive = item.variant === "destructive"

  return (
    <>
      {Icon ? (
        <Icon
          className={cn(
            destructive ? "text-destructive" : "text-muted-foreground"
          )}
        />
      ) : null}
      <span className={destructive ? "text-destructive" : undefined}>
        {item.label}
      </span>
    </>
  )
}

function getAuthUserMenuItemVariant(
  variant: AuthUserButtonMenuItem["variant"]
): "default" | "destructive" | undefined {
  return variant === "destructive" ? "default" : variant
}

export type AuthUserButtonProps = {
  className?: string
  size?: "icon" | "default" | "compact" | "sidebar"
  align?: "start" | "center" | "end"
  menuItems?: AuthUserButtonMenuItem[]
  hideSettings?: boolean
  showWorkspaceMenu?: boolean
  /** When `size` is `sidebar`, pass collapsed state so the menu uses flyout positioning. */
  sidebarCollapsed?: boolean
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
        <div className="flex min-w-0 flex-1 items-center gap-2 in-data-[collapsed]:hidden">
          <AuthUserAvatar
            className="size-6 shrink-0 rounded-lg"
            loading={isPending}
            user={user}
          />
          <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
            {isPending && !user ? (
              <>
                <span className="truncate font-medium">Loading...</span>
              </>
            ) : (
              <>
                <span className="truncate font-medium">
                  {user?.name ?? "User"}
                </span>
                {user?.email ? (
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    {user.email}
                  </span>
                ) : null}
              </>
            )}
          </div>
        </div>
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
  sidebarCollapsed = false,
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
  const isCollapsedSidebar = isSidebar && sidebarCollapsed
  const triggerLabel = user?.name ?? user?.email ?? "Account menu"
  const hasAccountSection = menuItems.length > 0 || !hideSettings

  let menuPopupSide: "top" | "right" | "bottom" = "bottom"
  if (isCollapsedSidebar) {
    menuPopupSide = "right"
  } else if (isSidebar) {
    menuPopupSide = "top"
  }

  const menuPopupAlign = isSidebar ? "start" : align
  const menuPopupSideOffset = isSidebar ? 8 : 4
  const menuPopupClassName =
    isSidebar && !sidebarCollapsed ? "min-w-(--anchor-width)" : undefined

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={isIconOnly ? "Account menu" : triggerLabel}
          className={getTriggerClassName(size, className)}
          disabled={isPending && !user}
        >
          <TriggerContent isPending={isPending} size={size} user={user} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={menuPopupAlign}
        className={menuPopupClassName}
        side={menuPopupSide}
        sideOffset={menuPopupSideOffset}
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
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <AuthUserView className="px-2 py-1.5" user={user} />
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1.5" />
              </>
            )}

            {showWorkspaceMenu && hasAccountSection ? (
              <DropdownMenuSeparator className="my-1.5" />
            ) : null}

            {menuItems.map((item) => {
              const Icon = item.icon
              const content = renderAuthUserMenuItemContent(item, Icon)
              const menuItemVariant = getAuthUserMenuItemVariant(item.variant)

              if (item.href) {
                return (
                  <DropdownMenuItem
                    key={item.label}
                    asChild
                    className={
                      item.variant === "destructive"
                        ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
                        : ""
                    }
                  >
                    <Link
                      className="flex w-full items-center gap-2"
                      to={item.href}
                    >
                      {content}
                    </Link>
                  </DropdownMenuItem>
                )
              }

              return (
                <DropdownMenuItem
                  key={item.label}
                  onClick={item.onClick}
                  variant={menuItemVariant}
                >
                  {content}
                </DropdownMenuItem>
              )
            })}

            {!hideSettings ? (
              <DropdownMenuItem
                onClick={() => config.navigate(config.routes.settingsAccount)}
              >
                <Settings className="text-muted-foreground" />
                Account settings
              </DropdownMenuItem>
            ) : null}

            <DropdownMenuSeparator className="my-1.5" />

            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="text-muted-foreground" />
              Sign out
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
