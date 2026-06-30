"use client"

import { ChevronsUpDown } from "lucide-react"
import type React from "react"
import {
  Menu,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@workspace/ui/components/menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import type { ShellLinkProps, UserMenuItem } from "./shell/types"
import {
  getUserInitials,
  UserMenuItemsList,
} from "./shell/user-menu-content"

function UserIdentityBlock({
  user,
  emailClassName,
}: {
  user: { name: string; email: string; avatar: string }
  emailClassName: string
}): React.ReactElement {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage alt={user.name} src={user.avatar} />
        <AvatarFallback className="rounded-lg">
          {getUserInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user.name}</span>
        <span className={emailClassName}>{user.email}</span>
      </div>
    </>
  )
}

function DefaultNavLink({
  href,
  children,
  ...props
}: ShellLinkProps): React.ReactElement {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}

export function NavUser({
  user,
  menuItems = [],
  signOutLabel = "Sign out",
  onSignOut,
  linkComponent: LinkComponent = DefaultNavLink,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  menuItems?: UserMenuItem[]
  signOutLabel?: string
  onSignOut?: () => void
  linkComponent?: React.ComponentType<ShellLinkProps>
}): React.ReactElement {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger
            render={
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                size="lg"
                tooltip="Profile"
              >
                <UserIdentityBlock
                  emailClassName="truncate text-xs text-sidebar-foreground/60"
                  user={user}
                />
                <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            }
          />
          <MenuPopup
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <UserIdentityBlock
                emailClassName="truncate text-xs text-muted-foreground"
                user={user}
              />
            </div>
            {menuItems.length > 0 ? <MenuSeparator /> : null}
            <UserMenuItemsList
              iconClassName="mr-2 size-4"
              linkComponent={LinkComponent}
              menuItems={menuItems}
              onSignOut={onSignOut}
              signOutLabel={signOutLabel}
            />
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
