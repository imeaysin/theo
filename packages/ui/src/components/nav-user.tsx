"use client"

import {
  ChevronsUpDown,
  CircleHelp,
  LogOut,
  Map,
  Moon,
  Settings,
  User,
} from "lucide-react"

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
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"

export function NavUser({
  user,
  onSignOut,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  onSignOut?: () => void
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip="Profile"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            }
          />
          <MenuPopup
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </div>
            <MenuSeparator />
            <MenuItem render={<a href="/settings/my-account/profile" />}>
              <User className="mr-2 size-4" />
              My profile
            </MenuItem>
            <MenuItem render={<a href="/settings/my-account/general" />}>
              <Settings className="mr-2 size-4" />
              My settings
            </MenuItem>
            <MenuItem render={<a href="/settings/my-account/out-of-office" />}>
              <Moon className="mr-2 size-4" />
              Out of office
            </MenuItem>
            <MenuSeparator />
            <MenuItem render={<a href="#" target="_blank" rel="noreferrer" />}>
              <Map className="mr-2 size-4" />
              Visit roadmap
            </MenuItem>
            <MenuItem onClick={() => console.log("Help")}>
              <CircleHelp className="mr-2 size-4" />
              Help
            </MenuItem>
            <MenuSeparator />
            <MenuItem onClick={onSignOut}>
              <LogOut className="mr-2 size-4" />
              Sign out
            </MenuItem>
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
