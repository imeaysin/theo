import { useMemo } from "react"
import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom"
import {
  CircleHelpIcon,
  CopyIcon,
  ExternalLinkIcon,
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
import { toastManager } from "@workspace/ui/components/toast"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { useSignOutMutation } from "@/features/auth/hooks/use-auth-mutations"
import {
  getAppMobileMoreItems,
  getAppNavigation,
} from "@/config/app-navigation"
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

/** Post-login shell. Routes live in features; nav lives in `config/app-navigation.ts`. */
export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: session, isPending: userLoading } = useAuthSession()
  const signOut = useSignOutMutation()
  const user = session?.user

  const navigation = useMemo(() => getAppNavigation(user?.role), [user?.role])

  const publicPageUrl = useMemo(() => {
    const slug = user?.name?.trim().toLowerCase().replace(/\s+/g, "-") || "user"
    if (typeof window === "undefined") return `/${slug}`
    return `${window.location.origin}/${slug}`
  }, [user?.name])

  const mobileMoreItems = useMemo(
    () => getAppMobileMoreItems(publicPageUrl),
    [publicPageUrl]
  )

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
        label: "View public page",
        href: publicPageUrl,
        icon: ExternalLinkIcon,
        target: "_blank",
        separatorBefore: true,
      },
      {
        label: "Copy public page link",
        icon: CopyIcon,
        onClick: () => {
          void navigator.clipboard.writeText(publicPageUrl).then(() => {
            toastManager.add({ title: "Link copied", type: "success" })
          })
        },
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
    [publicPageUrl]
  )

  const commandActions = useMemo<CommandAction[]>(() => {
    const items = flattenNavItems([
      ...navigation.filter((item) => item.name !== "more"),
      ...mobileMoreItems,
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
  }, [mobileMoreItems, navigate, navigation])

  return (
    <AppShell
      bottomNavItems={mobileMoreItems}
      brandLabel={site.name}
      commandActions={commandActions}
      linkComponent={ShellLink}
      logo={<Logo />}
      navigation={navigation}
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
