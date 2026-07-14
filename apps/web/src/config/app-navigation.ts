import {
  BookOpen,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { routes } from "@/config/routes"
import type { LucideIcon } from "lucide-react"

export type NavItem = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  requiredPermission?: string
  items?: NavItem[]
}

export const appNavigation = {
  navMain: [
    {
      title: "Playground",
      url: routes.dashboard,
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: routes.dashboard,
        },
        {
          title: "Notes",
          url: routes.notes,
        },
      ],
    },
    {
      title: "Settings",
      url: routes.settingsAccount,
      icon: Settings2,
      items: [
        {
          title: "Account",
          url: routes.settingsAccount,
        },
        {
          title: "Workspace",
          url: routes.organizationSettings,
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
  ] satisfies NavItem[],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export const adminNavigationItem = {
  title: "Admin",
  url: routes.adminUsers,
  icon: Settings2,
  items: [
    {
      title: "Users",
      url: routes.adminUsers,
    },
    {
      title: "Roles",
      url: routes.adminUsers,
    },
  ],
}
