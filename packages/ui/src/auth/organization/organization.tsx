"use client"

import {
  useActiveOrganization,
  useAuthenticate,
  useAuthUiConfig,
} from "@workspace/auth/react"
import { Settings as SettingsIcon, Users } from "lucide-react"
import { useEffect } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTab,
} from "@workspace/ui/components/tabs"
import { cn } from "@workspace/ui/lib/utils"
import { OrganizationPeople } from "./organization-people"
import { OrganizationSettings } from "./organization-settings"

export type OrganizationTabView = "settings" | "people"

export interface OrganizationProps {
  className?: string
  hideNav?: boolean
  view: OrganizationTabView
}

export function Organization({ className, hideNav, view }: OrganizationProps) {
  const config = useAuthUiConfig()
  useAuthenticate()

  const { data: activeOrganization, isPending } = useActiveOrganization()

  useEffect(() => {
    if (!isPending && !activeOrganization) {
      config.navigate(config.routes.defaultAuthenticated, { replace: true })
    }
  }, [activeOrganization, config, isPending])

  if (!isPending && !activeOrganization) {
    return null
  }

  return (
    <Tabs className={cn("w-full gap-4 md:gap-6", className)} value={view}>
      <div className={cn(hideNav && "hidden")}>
        <TabsList aria-label="Workspace settings">
          <TabsTab
            className="gap-1"
            onClick={() => config.navigate(config.routes.organizationSettings)}
            value="settings"
          >
            <SettingsIcon className="text-muted-foreground" />
            Settings
          </TabsTab>

          <TabsTab
            className="gap-1"
            onClick={() => config.navigate(config.routes.organizationPeople)}
            value="people"
          >
            <Users className="text-muted-foreground" />
            People
          </TabsTab>
        </TabsList>
      </div>

      <TabsContent tabIndex={-1} value="settings">
        <OrganizationSettings />
      </TabsContent>

      <TabsContent tabIndex={-1} value="people">
        <OrganizationPeople />
      </TabsContent>
    </Tabs>
  )
}
