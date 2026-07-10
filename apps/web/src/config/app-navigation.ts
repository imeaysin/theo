import {
  BellIcon,
  Building2Icon,
  LayoutDashboardIcon,
  ShieldIcon,
  StickyNoteIcon,
  UploadIcon,
  BotIcon,
} from "lucide-react"
import type { NavItem } from "@workspace/ui/components/shell"
import { routes } from "@/config/routes"

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
    name: "AI Assistant",
    href: routes.ai,
    icon: BotIcon,
    isCurrent: ({ pathname }) => pathname?.startsWith(routes.ai) ?? false,
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
    icon: Building2Icon,
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
