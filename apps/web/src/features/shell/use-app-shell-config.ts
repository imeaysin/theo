import { useMemo } from "react"
import { useLocation } from "react-router-dom"
import {
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  SettingsIcon,
} from "lucide-react"
import type { AuthUserButtonMenuItem } from "@workspace/ui-shadcn/auth"
import { appNavigation, adminNavigationItem } from "@/config/app-navigation"
import { routes } from "@/config/routes"
import { site } from "@/config/site"
import {
  usePlatformPermission,
  useAuthSession,
  useActiveOrganization,
  useListOrganizations,
  useSignOut,
} from "@workspace/auth/react"
import { platformUiPermissions } from "@workspace/ui-shadcn/auth"

export function useAppShellConfig() {
  const signOut = useSignOut()
  const location = useLocation()
  const pathname = location.pathname

  const { data: adminPermission } = usePlatformPermission(
    platformUiPermissions.listUsers
  )

  const { data: session } = useAuthSession()
  const { data: activeOrganization } = useActiveOrganization()
  const { data: organizations } = useListOrganizations()

  const navMain = useMemo(() => {
    const baseItems = appNavigation.navMain.map((item) => ({
      ...item,
      items: item.items?.filter((sub) => {
        if (sub.title === "Workspace" && !activeOrganization) return false
        return true
      }),
    }))

    const allItems = adminPermission?.success
      ? [...baseItems, adminNavigationItem]
      : baseItems

    return allItems.map((item) => {
      const isUrlActive =
        pathname === item.url ||
        (item.items &&
          item.items.length === 0 &&
          pathname.startsWith(`${item.url}/`))

      const hasActiveSubItem = item.items?.some(
        (sub) => pathname === sub.url || pathname.startsWith(`${sub.url}/`)
      )

      return {
        ...item,
        isActive: isUrlActive || hasActiveSubItem,
        items: item.items?.map((sub) => ({
          ...sub,
          isActive: pathname === sub.url || pathname.startsWith(`${sub.url}/`),
        })),
      }
    })
  }, [adminPermission?.success, pathname, activeOrganization])

  const projects = useMemo(() => {
    return appNavigation.projects.map((proj) => ({
      ...proj,
      isActive: pathname === proj.url || pathname.startsWith(`${proj.url}/`),
    }))
  }, [pathname])

  const user = {
    name: session?.user?.name ?? "User",
    email: session?.user?.email ?? "",
    avatar: session?.user?.image ?? "",
  }

  const teams = useMemo(() => {
    if (!organizations || organizations.length === 0) {
      return [
        {
          name: activeOrganization?.name ?? "Personal Workspace",
          logo: GalleryVerticalEnd,
          plan: "Free",
        },
      ]
    }
    const logos = [GalleryVerticalEnd, AudioWaveform, Command]
    return organizations.map((org, index) => ({
      name: org.name,
      logo: logos[index % logos.length] ?? GalleryVerticalEnd,
      plan: org.slug ?? "Pro",
    }))
  }, [organizations, activeOrganization])

  const userMenuItems = useMemo<AuthUserButtonMenuItem[]>(() => {
    return [
      {
        label: "Account settings",
        href: routes.settingsAccount,
        icon: SettingsIcon,
      },
      ...(activeOrganization
        ? [
            {
              label: "Workspace settings",
              href: routes.organizationSettings,
              icon: SettingsIcon,
            },
          ]
        : []),
    ]
  }, [activeOrganization])

  return {
    brandLabel: site.name,
    navMain,
    projects,
    user,
    teams,
    onSignOut: () => signOut.mutate(),
    userMenuItems,
  }
}
