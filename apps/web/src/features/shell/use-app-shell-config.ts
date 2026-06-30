import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { SettingsIcon } from "lucide-react"
import { flattenNavItems } from "@workspace/ui/components/shell"
import type {
  CommandAction,
  UserMenuItem,
} from "@workspace/ui/components/shell"
import { appNavigation } from "@/config/app-navigation"
import { routes } from "@/config/routes"
import { site } from "@/config/site"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { useSignOutMutation } from "@/features/auth/hooks/use-auth-mutations"

export function useAppShellConfig() {
  const navigate = useNavigate()
  const { data: session, isPending: userLoading } = useAuthSession()
  const signOut = useSignOutMutation()
  const user = session?.user

  const navigation = useMemo(() => appNavigation, [])

  const userMenuItems = useMemo<UserMenuItem[]>(
    () => [
      {
        label: "Settings",
        href: routes.settings,
        icon: SettingsIcon,
      },
    ],
    []
  )

  const commandActions = useMemo<CommandAction[]>(() => {
    return flattenNavItems(navigation).map((item) => ({
      id: item.href || item.name,
      name: item.name,
      section: "Navigation",
      keywords: item.name,
      href: item.href || undefined,
      onSelect: item.href ? () => navigate(item.href) : undefined,
    }))
  }, [navigate, navigation])

  return {
    brandLabel: site.name,
    commandActions,
    navigation,
    onSignOut: () => signOut.mutate(),
    user: user
      ? {
          name: user.name ?? "User",
          email: user.email ?? "",
          avatarUrl: user.image ?? undefined,
        }
      : null,
    userLoading,
    userMenuItems,
  }
}
