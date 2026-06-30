import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  CircleHelpIcon,
  CopyIcon,
  ExternalLinkIcon,
  MapIcon,
  MoonIcon,
  SettingsIcon,
} from "lucide-react"
import { flattenNavItems } from "@workspace/ui/components/shell"
import type {
  CommandAction,
  NavItem,
  UserMenuItem,
} from "@workspace/ui/components/shell"
import {
  COPY_PUBLIC_PAGE_LINK_HREF,
  getAppMobileMoreItems,
  getAppNavigation,
} from "@/config/app-navigation"
import { paths } from "@/config/paths"
import { site } from "@/config/site"
import { buildPublicPageUrl, copyPublicPageLink } from "@/lib/public-page"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { useSignOutMutation } from "@/features/auth/hooks/use-auth-mutations"

function withPublicPageActions(
  items: NavItem[],
  publicPageUrl: string
): NavItem[] {
  return items.map((item) => {
    if (item.href === COPY_PUBLIC_PAGE_LINK_HREF) {
      return {
        ...item,
        onClick: (event) => {
          event.preventDefault()
          copyPublicPageLink(publicPageUrl)
        },
      }
    }
    return item
  })
}

function createCommandSelectAction(
  item: Pick<NavItem, "href" | "name">,
  options: { navigate: (path: string) => void; publicPageUrl: string }
): (() => void) | undefined {
  if (item.href === COPY_PUBLIC_PAGE_LINK_HREF) {
    return () => copyPublicPageLink(options.publicPageUrl)
  }
  if (item.href) {
    return () => options.navigate(item.href)
  }
  return undefined
}

export function useAppShellConfig() {
  const navigate = useNavigate()
  const { data: session, isPending: userLoading } = useAuthSession()
  const signOut = useSignOutMutation()
  const user = session?.user

  const navigation = useMemo(() => getAppNavigation(user?.role), [user?.role])

  const publicPageUrl = useMemo(
    () => buildPublicPageUrl(user?.name),
    [user?.name]
  )

  const mobileMoreItems = useMemo(
    () =>
      withPublicPageActions(
        getAppMobileMoreItems(publicPageUrl),
        publicPageUrl
      ),
    [publicPageUrl]
  )

  const userMenuItems = useMemo<UserMenuItem[]>(
    () => [
      {
        label: "Settings",
        href: paths.account.settings,
        icon: SettingsIcon,
      },
      {
        label: "Out of office",
        href: paths.account.outOfOffice,
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
        onClick: () => copyPublicPageLink(publicPageUrl),
      },
      {
        label: "Visit roadmap",
        href: site.links.roadmap,
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
      onSelect: createCommandSelectAction(item, { navigate, publicPageUrl }),
    }))
  }, [mobileMoreItems, navigate, navigation, publicPageUrl])

  return {
    bottomNavItems: mobileMoreItems,
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
