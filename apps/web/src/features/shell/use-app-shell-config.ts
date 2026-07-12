import { useMemo } from "react"
import { SettingsIcon } from "lucide-react"
import type { AuthUserButtonMenuItem } from "@workspace/ui-shadcn/auth"
import { appNavigation, adminNavigationItem } from "@/config/app-navigation"
import { routes } from "@/config/routes"
import { site } from "@/config/site"
import { usePlatformPermission, useSignOut } from "@workspace/auth/react"
import { platformUiPermissions } from "@workspace/ui-shadcn/auth"
import { useUnreadCountQuery } from "@/features/notifications/hooks/use-notifications"

export function useAppShellConfig() {
  const signOut = useSignOut()
  const { data: adminPermission } = usePlatformPermission(
    platformUiPermissions.listUsers
  )
  const { data: unreadCount } = useUnreadCountQuery()

  const navigation = useMemo(() => {
    const items = appNavigation.map((item) => {
      if (item.href !== routes.notifications) return item
      const count = unreadCount?.count ?? 0
      if (count === 0) return item
      return { ...item, badge: count > 99 ? "99+" : String(count) }
    })
    if (!adminPermission?.success) return items
    return [...items, adminNavigationItem]
  }, [adminPermission?.success, unreadCount?.count])

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
    navigation,
    onSignOut: () => signOut.mutate(),
    userMenuItems,
  }
}
