"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui-shadcn/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui-shadcn/components/sidebar"
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react"

export type TeamSwitcherTeam = {
  id: string
  name: string
  logo: React.ReactNode
  plan: string
}

export function TeamSwitcher({
  teams,
  activeTeamId,
  onTeamChange,
  onAddTeam,
}: {
  teams: TeamSwitcherTeam[]
  activeTeamId?: string | null
  onTeamChange?: (team: TeamSwitcherTeam) => void
  onAddTeam?: () => void
}) {
  const { isMobile } = useSidebar()
  const activeTeam =
    teams.find((team) => team.id === activeTeamId) ??
    teams.find((team) => team.id === teams[0]?.id) ??
    teams[0]

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                size="lg"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {activeTeam.logo}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{activeTeam.name}</span>
              <span className="truncate text-xs">{activeTeam.plan}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-(--anchor-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Teams
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  className="gap-2 p-2"
                  key={team.id}
                  onClick={() => onTeamChange?.(team)}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    {team.logo}
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            {onAddTeam ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="gap-2 p-2" onClick={onAddTeam}>
                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                      <PlusIcon />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Add team
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
