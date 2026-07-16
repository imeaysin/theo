"use client"

import * as React from "react"
import { AppSidebar as UiAppSidebar } from "@workspace/ui-shadcn/components/app-sidebar"
import type { ComponentProps } from "react"
import { CreateOrganizationDialog } from "@/features/shell/components/create-organization-dialog"
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

type AppSidebarProps = Omit<
  ComponentProps<typeof UiAppSidebar>,
  | "user"
  | "teams"
  | "navMain"
  | "projects"
  | "userMenuItems"
  | "activeTeamId"
  | "onSignOut"
  | "onTeamChange"
  | "onAddTeam"
  | "linkComponent"
>

export function AppSidebar(props: AppSidebarProps) {
  const {
    navMain,
    projects,
    user,
    teams,
    activeTeamId,
    onSignOut,
    onTeamChange,
    onAddTeam,
    userMenuItems,
    createOrganizationOpen,
    setCreateOrganizationOpen,
  } = useAppShellConfig()

  return (
    <>
      <UiAppSidebar
        activeTeamId={activeTeamId}
        linkComponent={RouterLink}
        navMain={navMain}
        onAddTeam={onAddTeam}
        onSignOut={onSignOut}
        onTeamChange={onTeamChange}
        projects={projects}
        teams={teams}
        user={user}
        userMenuItems={userMenuItems}
        {...props}
      />
      <CreateOrganizationDialog
        onOpenChange={setCreateOrganizationOpen}
        open={createOrganizationOpen}
      />
    </>
  )
}
