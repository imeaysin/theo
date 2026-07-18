"use client"

import type { OrganizationView } from "@better-auth-ui/core/plugins"
import { useAuth, useAuthenticate, useAuthPlugin } from "@better-auth-ui/react"
import {
  Settings as SettingsIcon,
  Shield as ShieldIcon,
  User2 as UserIcon,
} from "lucide-react"
import { useEffect, useMemo } from "react"
import { authClient } from "@workspace/auth/client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui-shadcn/components/tabs"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { cn } from "@workspace/ui-shadcn/lib/utils"
import { PageHeader } from "@/components/page-header"
import { OrganizationPeople } from "@/features/auth/components/organization/organization-people"
import { OrganizationRoles } from "@/features/auth/components/organization/organization-roles"
import { OrganizationSettings } from "@/features/auth/components/organization/organization-settings"

export type OrganizationProps = {
  className?: string
  hideNav?: boolean
  path?: string
  /** @remarks `OrganizationView` */
  view?: OrganizationView
}

type OrganizationHrefOptions = {
  readonly basePath: string
  readonly slug: string | null | undefined
  readonly slugPrefix: string
  readonly segment: string
}

function organizationHref(options: OrganizationHrefOptions) {
  const { basePath, slug, slugPrefix, segment } = options
  if (slug) {
    return `${basePath}/${slugPrefix}${slug}/${segment}`
  }
  return `${basePath}/${segment}`
}

function resolveOrganizationView(options: {
  readonly view: OrganizationView | undefined
  readonly path: string | undefined
  readonly viewPaths: Record<string, string>
}): OrganizationView | undefined {
  if (options.view) return options.view

  for (const [key, segment] of Object.entries(options.viewPaths)) {
    if (segment !== options.path) continue
    if (key === "settings" || key === "people" || key === "roles") {
      return key
    }
  }
  return undefined
}

/**
 * Organization management shell: settings, people, and custom roles tabs.
 */
export function Organization({
  className,
  hideNav,
  path,
  view,
}: OrganizationProps) {
  if (!view && !path) {
    throw new Error("[Better Auth UI] Either `view` or `path` must be provided")
  }

  const {
    authClient: sessionClient,
    basePaths,
    localization,
    navigate,
  } = useAuth()
  useAuthenticate(sessionClient)

  const {
    localization: organizationLocalization,
    viewPaths: organizationViewPaths,
    slug,
    slugPrefix,
  } = useAuthPlugin(organizationPlugin)

  const { data: activeOrganization, isPending } =
    authClient.useActiveOrganization()

  useEffect(() => {
    if (!isPending && !activeOrganization) {
      navigate({
        to: `${basePaths.settings}/${organizationViewPaths.settings?.organizations}`,
        replace: true,
      })
    }
  }, [
    basePaths.settings,
    isPending,
    navigate,
    organizationViewPaths.settings?.organizations,
    activeOrganization,
  ])

  const currentView = useMemo(
    () =>
      resolveOrganizationView({
        view,
        path,
        viewPaths: organizationViewPaths.organization,
      }),
    [view, path, organizationViewPaths.organization]
  )

  if (!currentView) {
    const validPaths = Object.values(organizationViewPaths.organization).join(
      ", "
    )
    throw new Error(
      `[Better Auth UI] Unknown organization path "${path}". Valid paths are: ${validPaths}`
    )
  }

  if (!isPending && !activeOrganization) {
    return null
  }

  const rolesPath = organizationViewPaths.organization.roles ?? "roles"

  const pageCopy = {
    settings: {
      title: localization.settings.settings,
      description: "Manage organization profile, API keys, and danger zone.",
    },
    people: {
      title: organizationLocalization.people,
      description: "Manage members and invitations for this organization.",
    },
    roles: {
      title: "Roles",
      description: "Review built-in roles and create custom permission sets.",
    },
  } as const

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <PageHeader
        description={pageCopy[currentView].description}
        title={pageCopy[currentView].title}
      />

      <Tabs value={currentView} className="w-full gap-4 md:gap-6">
        <div className={cn(hideNav && "hidden")}>
          <TabsList aria-label={localization.settings.settings}>
            <TabsTrigger
              value="settings"
              className="gap-1"
              onClick={() =>
                navigate({
                  to: organizationHref({
                    basePath: basePaths.organization,
                    slug,
                    slugPrefix,
                    segment: organizationViewPaths.organization.settings,
                  }),
                })
              }
            >
              <SettingsIcon className="text-muted-foreground" />
              {localization.settings.settings}
            </TabsTrigger>

            <TabsTrigger
              value="people"
              className="gap-1"
              onClick={() =>
                navigate({
                  to: organizationHref({
                    basePath: basePaths.organization,
                    slug,
                    slugPrefix,
                    segment: organizationViewPaths.organization.people,
                  }),
                })
              }
            >
              <UserIcon className="text-muted-foreground" />
              {organizationLocalization.people}
            </TabsTrigger>

            <TabsTrigger
              value="roles"
              className="gap-1"
              onClick={() =>
                navigate({
                  to: organizationHref({
                    basePath: basePaths.organization,
                    slug,
                    slugPrefix,
                    segment: rolesPath,
                  }),
                })
              }
            >
              <ShieldIcon className="text-muted-foreground" />
              Roles
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="settings" tabIndex={-1}>
          <OrganizationSettings />
        </TabsContent>

        <TabsContent value="people" tabIndex={-1}>
          <OrganizationPeople />
        </TabsContent>

        <TabsContent value="roles" tabIndex={-1}>
          <OrganizationRoles />
        </TabsContent>
      </Tabs>
    </div>
  )
}
