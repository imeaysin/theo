import { LayoutDashboardIcon, StickyNoteIcon } from "lucide-react"
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
]
