import { useMemo } from "react"
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
  const { data: adminPermission } = usePlatformPermission(
    platformUiPermissions.listUsers
  )

  const { data: session } = useAuthSession()
  const { data: activeOrganization } = useActiveOrganization()
  const { data: organizations } = useListOrganizations()

  const navMain = useMemo(() => {
    let items = appNavigation.navMain

    if (adminPermission?.success) {
      items = [...items, adminNavigationItem]
    }
    return items
  }, [adminPermission?.success])

  const projects = appNavigation.projects

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
          logo: GalleryVerticalEnd as React.ElementType,
          plan: "Free",
        },
      ]
    }
    const logos = [GalleryVerticalEnd, AudioWaveform, Command]
    return organizations.map((org, index) => ({
      name: org.name,
      logo: logos[index % logos.length] as React.ElementType,
      plan: org.slug ?? "Pro",
    }))
  }, [organizations, activeOrganization])

  const userMenuItems = useMemo<AuthUserButtonMenuItem[]>(
    () => [
      {
        label: "Account settings",
        href: routes.settingsAccount,
        icon: SettingsIcon,
      },
    ],
    []
  )

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
