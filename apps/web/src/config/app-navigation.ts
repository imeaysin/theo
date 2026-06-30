import {
  BarChart3Icon,
  CalendarIcon,
  ClockIcon,
  CopyIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  LayoutGridIcon,
  Link2Icon,
  RouteIcon,
  WorkflowIcon,
} from "lucide-react"
import { MORE_SEPARATOR_NAME } from "@workspace/ui/components/shell"
import type { NavItem } from "@workspace/ui/components/shell"
import { toastManager } from "@workspace/ui/components/toast"
import { paths } from "@/config/paths"

/** App sidebar entry — extend with `roles` when RBAC is wired up. */
export type AppNavItem = NavItem & { roles?: string[] }

const dashboardBase = paths.dashboard

const appNavigationItems: AppNavItem[] = [
  {
    name: "Event types",
    href: dashboardBase,
    icon: Link2Icon,
    isCurrent: ({ pathname }) =>
      pathname === dashboardBase ||
      (pathname?.startsWith(`${dashboardBase}/event-types`) ?? false),
  },
  {
    name: "Bookings",
    href: `${dashboardBase}/bookings`,
    icon: CalendarIcon,
    isCurrent: ({ pathname }) =>
      pathname?.startsWith(`${dashboardBase}/bookings`) ?? false,
  },
  {
    name: "Availability",
    href: `${dashboardBase}/availability`,
    icon: ClockIcon,
  },
  {
    name: "Routing forms",
    href: `${dashboardBase}/routing-forms`,
    icon: RouteIcon,
    moreOnMobile: true,
  },
  {
    name: "Workflows",
    href: `${dashboardBase}/workflows`,
    icon: WorkflowIcon,
    moreOnMobile: true,
  },
  {
    name: "Insights",
    href: `${dashboardBase}/insights`,
    icon: BarChart3Icon,
    moreOnMobile: true,
    child: [
      {
        name: "Bookings",
        href: `${dashboardBase}/insights/bookings`,
      },
      {
        name: "Routing",
        href: `${dashboardBase}/insights/routing`,
      },
    ],
  },
  {
    name: "Apps",
    href: `${dashboardBase}/apps`,
    icon: LayoutGridIcon,
    moreOnMobile: true,
    isCurrent: ({ pathname, item }) => pathname?.startsWith(item.href) ?? false,
    child: [
      {
        name: "App Store",
        href: `${dashboardBase}/apps`,
        isCurrent: ({ pathname, item }) =>
          (pathname?.startsWith(item.href) ?? false) &&
          !(pathname?.includes("/installed") ?? false),
      },
      {
        name: "Installed apps",
        href: `${dashboardBase}/apps/installed`,
        isCurrent: ({ pathname }) =>
          pathname?.startsWith(`${dashboardBase}/apps/installed`) ?? false,
      },
    ],
  },
  {
    name: MORE_SEPARATOR_NAME,
    href: "",
    icon: EllipsisIcon,
  },
]

function filterByRole(items: AppNavItem[], role?: string | null): NavItem[] {
  return items
    .filter(
      (item) => !item.roles?.length || (role && item.roles.includes(role))
    )
    .map(({ roles: _roles, ...item }) => item)
}

/** Sidebar nav for the authenticated app shell. */
export function getAppNavigation(role?: string | null): NavItem[] {
  return filterByRole(appNavigationItems, role)
}

/** Mobile "more" drawer links (not shown in desktop sidebar). */
export function getAppMobileMoreItems(publicPageUrl: string): NavItem[] {
  return [
    {
      name: "View public page",
      href: publicPageUrl,
      icon: ExternalLinkIcon,
      target: "_blank",
    },
    {
      name: "Copy public page link",
      href: "",
      icon: CopyIcon,
      onClick: (event) => {
        event.preventDefault()
        void navigator.clipboard.writeText(publicPageUrl).then(() => {
          toastManager.add({ title: "Link copied", type: "success" })
        })
      },
    },
  ]
}
