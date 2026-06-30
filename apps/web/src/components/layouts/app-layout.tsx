import { useMemo } from "react"
import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom"
import {
  CircleHelpIcon,
  MapIcon,
  MoonIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"
import { AppShell, flattenNavItems } from "@workspace/ui/components/shell"
import type {
  CommandAction,
  ShellLinkComponent,
  ShellLinkProps,
  UserMenuItem,
} from "@workspace/ui/components/shell"
import { Logo } from "@workspace/ui/components/logo"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { useSignOutMutation } from "@/features/auth/hooks/use-auth-mutations"
import { dashboardMainNavigation } from "@/features/dashboard/dashboard-navigation"
import { useDashboardBottomNavItems } from "@/features/dashboard/hooks/use-dashboard-bottom-nav-items"
import { paths } from "@/config/paths"
import { site } from "@/config/site"

const ShellLink: ShellLinkComponent = ({
  href,
  children,
  ...props
}: ShellLinkProps) => (
  <RouterLink to={href} {...props}>
    {children}
  </RouterLink>
)

/** Authenticated app chrome — sidebar, mobile nav, and command palette. */
export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: session, isPending: userLoading } = useAuthSession()
  const signOut = useSignOutMutation()
  const user = session?.user
  const bottomNavItems = useDashboardBottomNavItems()

  const commandActions = useMemo<CommandAction[]>(() => {
    const items = flattenNavItems([
      ...dashboardMainNavigation.filter((item) => item.name !== "more"),
      ...bottomNavItems,
    ])

    return items.map((item) => ({
      id: item.href || item.name,
      name: item.name,
      section: "Navigation",
      keywords: item.name,
      href: item.href || undefined,
      onSelect: item.onClick
        ? undefined
        : () => {
            if (item.href) navigate(item.href)
          },
    }))
  }, [bottomNavItems, navigate])

  const userMenuItems = useMemo<UserMenuItem[]>(
    () => [
      {
        label: "My profile",
        href: paths.auth.settings,
        icon: UserIcon,
      },
      {
        label: "My settings",
        href: paths.auth.settings,
        icon: SettingsIcon,
      },
      {
        label: "Out of office",
        href: `${paths.auth.settings}/out-of-office`,
        icon: MoonIcon,
      },
      {
        label: "Visit roadmap",
        href: "https://cal.com/roadmap",
        icon: MapIcon,
        target: "_blank",
        rel: "noreferrer",
        separatorBefore: true,
      },
      {
        label: "Help",
        icon: CircleHelpIcon,
      },
    ],
    []
  )

  return (
    <AppShell
      bottomNavItems={bottomNavItems}
      brandLabel={site.name}
      commandActions={commandActions}
      linkComponent={ShellLink}
      logo={<Logo />}
      navigation={dashboardMainNavigation}
      onSignOut={() => signOut.mutate()}
      pathname={location.pathname}
      userLoading={userLoading}
      withoutMain
      user={
        user
          ? {
              name: user.name ?? "User",
              email: user.email ?? "",
              avatarUrl: user.image ?? undefined,
            }
          : null
      }
      userMenuItems={userMenuItems}
    >
      <Outlet />
    </AppShell>
  )
}
