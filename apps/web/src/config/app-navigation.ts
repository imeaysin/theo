import {
  Building2Icon,
  LayoutDashboardIcon,
  StickyNoteIcon,
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
    name: "Workspace",
    href: routes.organizationSettings,
    icon: Building2Icon,
    isCurrent: ({ pathname }) =>
      pathname?.startsWith(routes.organization) ?? false,
  },
]
