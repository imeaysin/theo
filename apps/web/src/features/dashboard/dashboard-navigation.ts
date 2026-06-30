import {
  BarChart3Icon,
  CalendarIcon,
  ClockIcon,
  EllipsisIcon,
  LayoutGridIcon,
  Link2Icon,
  RouteIcon,
  WorkflowIcon,
} from "lucide-react"
import { MORE_SEPARATOR_NAME } from "@workspace/ui/components/shell"
import type { NavItem } from "@workspace/ui/components/shell"
import { paths } from "@/config/paths"

const dashboardBase = paths.dashboard

export const dashboardMainNavigation: NavItem[] = [
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
