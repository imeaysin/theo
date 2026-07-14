"use client"

import {
  useActiveOrganization,
  useAuthenticate,
  useAuthUiConfig,
  useListOrganizations,
} from "@workspace/auth/react"
import {
  Building2,
  Settings as SettingsIcon,
  Shield,
  Users,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTab,
} from "@workspace/ui/components/tabs"
import { cn } from "@workspace/ui/lib/utils"
import type { OrganizationPeopleProps } from "./organization-people"
import { OrganizationPeople } from "./organization-people"
import type { OrganizationRolesProps } from "./organization-roles"
import { OrganizationRoles } from "./organization-roles"
import type { OrganizationSettingsProps } from "./organization-settings"
import { OrganizationSettings } from "./organization-settings"

export type OrganizationTabView = "settings" | "people" | "roles"

export type OrganizationProps = {
  className?: string
  hideNav?: boolean
  view: OrganizationTabView
  settings?: OrganizationSettingsProps
  people?: OrganizationPeopleProps
  roles?: OrganizationRolesProps
  onCreateOrganization?: () => void
}

export function Organization({
  className,
  hideNav,
  view,
  settings,
  people,
  roles,
  onCreateOrganization,
}: OrganizationProps) {
  const config = useAuthUiConfig()
  useAuthenticate()

  const { data: activeOrganization, isPending: activePending } =
    useActiveOrganization()
  const { isPending: organizationsPending } = useListOrganizations()

  const isPending = activePending || organizationsPending

  if (isPending) {
    return <Skeleton className="h-48 w-full rounded-xl" />
  }

  if (!activeOrganization) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building2 />
          </EmptyMedia>
          <EmptyTitle>No workspace yet</EmptyTitle>
          <EmptyDescription>
            Create a workspace to manage settings, members, and invitations.
          </EmptyDescription>
        </EmptyHeader>
        {onCreateOrganization ? (
          <EmptyContent>
            <Button onClick={onCreateOrganization} type="button">
              Create workspace
            </Button>
          </EmptyContent>
        ) : null}
      </Empty>
    )
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

          <TabsTab
            className="gap-1"
            onClick={() => config.navigate(config.routes.organizationRoles)}
            value="roles"
          >
            <Shield className="text-muted-foreground" />
            Roles
          </TabsTab>
        </TabsList>
      </div>

      <TabsContent tabIndex={-1} value="settings">
        <OrganizationSettings {...settings} />
      </TabsContent>

      <TabsContent tabIndex={-1} value="people">
        <OrganizationPeople {...people} />
      </TabsContent>

      <TabsContent tabIndex={-1} value="roles">
        <OrganizationRoles {...roles} />
      </TabsContent>
    </Tabs>
  )
}
