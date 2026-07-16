import { useCallback, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react"
import { useSession, signOut, authClient } from "@workspace/auth/client"
import { toast } from "sonner"
import { appNavigation } from "@/config/app-navigation"
import { routes } from "@/config/routes"
import { site } from "@/config/site"
import type {
  AppSidebarNavItem,
  AppSidebarProject,
  AppSidebarTeam,
  AppSidebarUserMenuItem,
} from "@workspace/ui-shadcn/components/app-sidebar"

type OrganizationSummary = {
  readonly id: string
  readonly name: string
  readonly slug?: string | null
}

const TEAM_LOGOS = [GalleryVerticalEnd, AudioWaveform, Command] as const

function toShellTeams(
  organizations: readonly OrganizationSummary[] | null | undefined
): AppSidebarTeam[] {
  if (!organizations || organizations.length === 0) {
    return []
  }

  return organizations.map((org, index) => {
    const Logo = TEAM_LOGOS[index % TEAM_LOGOS.length] ?? GalleryVerticalEnd
    return {
      id: org.id,
      name: org.name,
      logo: <Logo />,
      plan: org.slug ?? "Pro",
    }
  })
}

function toNavIcon(icon?: LucideIcon) {
  if (!icon) return undefined
  const Icon = icon
  return <Icon />
}

export function useAppShellConfig() {
  const location = useLocation()
  const pathname = location.pathname
  const { data: session } = useSession()
  const { data: activeOrganization } = authClient.useActiveOrganization()
  const { data: organizations } = authClient.useListOrganizations()
  const [createOrganizationOpen, setCreateOrganizationOpen] = useState(false)

  const navMain = useMemo<AppSidebarNavItem[]>(() => {
    return appNavigation.navMain.map((item) => {
      const isUrlActive =
        pathname === item.url ||
        (Boolean(item.items) &&
          (item.items?.length ?? 0) === 0 &&
          pathname.startsWith(`${item.url}/`))

      const hasActiveSubItem = item.items?.some(
        (sub) => pathname === sub.url || pathname.startsWith(`${sub.url}/`)
      )

      return {
        title: item.title,
        url: item.url,
        icon: toNavIcon(item.icon),
        isActive: Boolean(isUrlActive || hasActiveSubItem),
        items: item.items?.map((sub) => ({
          title: sub.title,
          url: sub.url,
          isActive: pathname === sub.url || pathname.startsWith(`${sub.url}/`),
        })),
      }
    })
  }, [pathname])

  const projects = useMemo<AppSidebarProject[]>(() => {
    return appNavigation.projects.map((proj) => ({
      name: proj.name,
      url: proj.url,
      icon: toNavIcon(proj.icon) ?? <Command />,
      isActive: pathname === proj.url || pathname.startsWith(`${proj.url}/`),
    }))
  }, [pathname])

  const teams = useMemo(() => toShellTeams(organizations), [organizations])

  const userMenuItems = useMemo<AppSidebarUserMenuItem[]>(
    () => [
      {
        label: "Settings",
        href: routes.settingsAccount,
        icon: <SettingsIcon />,
      },
    ],
    []
  )

  const onTeamChange = useCallback(async (team: AppSidebarTeam) => {
    const result = await authClient.organization.setActive({
      organizationId: team.id,
    })
    if (result.error) {
      toast.error(result.error.message ?? "Could not switch organization")
    }
  }, [])

  const onAddTeam = useCallback(() => {
    setCreateOrganizationOpen(true)
  }, [])

  return {
    brandLabel: site.name,
    navMain,
    projects,
    user: {
      name: session?.user.name ?? "User",
      email: session?.user.email ?? "",
      avatar: session?.user.image ?? "",
    },
    teams,
    activeTeamId:
      activeOrganization?.id ?? session?.session.activeOrganizationId ?? null,
    userMenuItems,
    onTeamChange,
    onAddTeam,
    createOrganizationOpen,
    setCreateOrganizationOpen,
    onSignOut: () => {
      void signOut()
    },
  }
}
