"use client"

import * as React from "react"
import { NavMain } from "@workspace/ui-shadcn/components/shell/nav-main"
import { NavProjects } from "@workspace/ui-shadcn/components/shell/nav-projects"
import { NavUser } from "@workspace/ui-shadcn/components/shell/nav-user"
import { TeamSwitcher } from "@workspace/ui-shadcn/components/shell/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui-shadcn/components/sidebar"
import { useAppShellConfig } from "@/features/shell/use-app-shell-config"
import { Link } from "react-router-dom"

const RouterLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<React.ComponentProps<typeof Link>, "to"> & { href?: string; to?: string }
>((props, ref) => {
  const { href, to, ...rest } = props
  return <Link ref={ref} to={to || href || "#"} {...rest} />
})
RouterLink.displayName = "RouterLink"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { navMain, projects, user, teams, onSignOut, userMenuItems } =
    useAppShellConfig()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} linkComponent={RouterLink} />
        <NavProjects projects={projects} linkComponent={RouterLink} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={user}
          menuItems={userMenuItems}
          onSignOut={onSignOut}
          linkComponent={RouterLink}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
