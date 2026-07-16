import { useCallback, useMemo } from "react"
import { useLocation } from "react-router-dom"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  type LucideIcon,
} from "lucide-react"
import { useSession, signOut, authClient } from "@workspace/auth/client"
import { toast } from "sonner"
import { appNavigation } from "@/config/app-navigation"
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

function toOrgSlug(seed: string) {
  const slug = seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
  return slug || "workspace"
}

export function useAppShellConfig() {
  const location = useLocation()
  const pathname = location.pathname
  const { data: session } = useSession()
  const { data: activeOrganization } = authClient.useActiveOrganization()
  const { data: organizations } = authClient.useListOrganizations()

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

  const userMenuItems = useMemo<AppSidebarUserMenuItem[]>(() => [], [])

  const onTeamChange = useCallback(async (team: AppSidebarTeam) => {
    const result = await authClient.organization.setActive({
      organizationId: team.id,
    })
    if (result.error) {
      toast.error(result.error.message ?? "Could not switch workspace")
    }
  }, [])

  const onAddTeam = useCallback(async () => {
    const seed =
      session?.user.name?.trim() ||
      session?.user.email?.split("@")[0] ||
      "workspace"
    const name = `${seed}'s Workspace`
    const slug = `${toOrgSlug(seed)}-${Date.now().toString(36)}`

    const created = await authClient.organization.create({ name, slug })
    if (created.error) {
      toast.error(created.error.message ?? "Could not create workspace")
      return
    }

    const organizationId = created.data?.id
    if (!organizationId) return

    const activated = await authClient.organization.setActive({
      organizationId,
    })
    if (activated.error) {
      toast.error(activated.error.message ?? "Could not activate workspace")
    }
  }, [session?.user.email, session?.user.name])

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
    onSignOut: () => {
      void signOut()
    },
  }
}
