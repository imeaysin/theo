"use client"

import type * as React from "react"
import { NavMain } from "@workspace/ui-shadcn/components/nav-main"
import { NavProjects } from "@workspace/ui-shadcn/components/nav-projects"
import { NavUser } from "@workspace/ui-shadcn/components/nav-user"
import { TeamSwitcher } from "@workspace/ui-shadcn/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui-shadcn/components/sidebar"

export type AppSidebarNavItem = {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: {
    title: string
    url: string
    isActive?: boolean
  }[]
}

export type AppSidebarProject = {
  name: string
  url: string
  icon: React.ReactNode
  isActive?: boolean
}

export type AppSidebarTeam = {
  id: string
  name: string
  logo: React.ReactNode
  plan: string
}

export type AppSidebarUser = {
  name: string
  email: string
  avatar: string
}

export type AppSidebarUserMenuItem = {
  label: string
  href?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: AppSidebarUser
  teams: AppSidebarTeam[]
  navMain: AppSidebarNavItem[]
  projects?: AppSidebarProject[]
  userMenuItems?: AppSidebarUserMenuItem[]
  activeTeamId?: string | null
  onSignOut?: () => void
  onTeamChange?: (team: AppSidebarTeam) => void
  onAddTeam?: () => void
  linkComponent?: React.ElementType
  navLabel?: string
  projectsLabel?: string
}

export function AppSidebar({
  user,
  teams,
  navMain,
  projects = [],
  userMenuItems,
  activeTeamId,
  onSignOut,
  onTeamChange,
  onAddTeam,
  linkComponent,
  navLabel,
  projectsLabel,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          activeTeamId={activeTeamId}
          onAddTeam={onAddTeam}
          onTeamChange={onTeamChange}
          teams={teams}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={navMain}
          label={navLabel}
          linkComponent={linkComponent}
        />
        {projects.length > 0 ? (
          <NavProjects
            label={projectsLabel}
            linkComponent={linkComponent}
            projects={projects}
          />
        ) : null}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          linkComponent={linkComponent}
          menuItems={userMenuItems}
          onSignOut={onSignOut}
          user={user}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
