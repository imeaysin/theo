import {
  BellIcon,
  LayoutDashboardIcon,
  ShieldIcon,
  StickyNoteIcon,
  UploadIcon,
  PieChartIcon,
  type LucideIcon,
} from "lucide-react"
import { routes } from "@/config/routes"

export type NavItem = {
  name: string
  href: string
  icon: LucideIcon
  badge?: string
  isCurrent?: (params: { pathname: string }) => boolean
}

export const appNavigation: NavItem[] = [
  {
    name: "Overview",
    href: routes.dashboard,
    icon: LayoutDashboardIcon,
    isCurrent: ({ pathname }) => pathname === routes.dashboard,
  },
  {
    name: "Notes",
    href: routes.notes,
    icon: StickyNoteIcon,
    isCurrent: ({ pathname }) => pathname?.startsWith(routes.notes) ?? false,
  },
  {
    name: "Uploads",
    href: routes.uploads,
    icon: UploadIcon,
    isCurrent: ({ pathname }) => pathname?.startsWith(routes.uploads) ?? false,
  },
  {
    name: "Notifications",
    href: routes.notifications,
    icon: BellIcon,
    isCurrent: ({ pathname }) =>
      pathname?.startsWith(routes.notifications) ?? false,
  },
  {
    name: "Workspace",
    href: routes.organizationSettings,
    icon: PieChartIcon,
    isCurrent: ({ pathname }) =>
      pathname?.startsWith(routes.organization) ?? false,
  },
]

export const adminNavigationItem: NavItem = {
  name: "Admin",
  href: routes.adminUsers,
  icon: ShieldIcon,
  isCurrent: ({ pathname }) => pathname?.startsWith(routes.admin) ?? false,
}
