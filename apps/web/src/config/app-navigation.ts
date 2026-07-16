import { Building2, SquareTerminal } from "lucide-react"
import { routes } from "@/config/routes"
import type { LucideIcon } from "lucide-react"

export type NavItem = {
  readonly title: string
  readonly url: string
  readonly icon?: LucideIcon
  readonly isActive?: boolean
  readonly items?: readonly NavItem[]
}

export type NavProject = {
  readonly name: string
  readonly url: string
  readonly icon: LucideIcon
}

const emptyProjects: readonly NavProject[] = []

export const appNavigation = {
  navMain: [
    {
      title: "Playground",
      url: routes.dashboard,
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Dashboard", url: routes.dashboard },
        { title: "Notes", url: routes.notes },
        { title: "Uploads", url: routes.uploads },
        { title: "Notifications", url: routes.notifications },
      ],
    },
    {
      title: "Workspace",
      url: routes.workspace,
      icon: Building2,
      items: [{ title: "Members & roles", url: routes.workspace }],
    },
  ] satisfies readonly NavItem[],
  projects: emptyProjects,
}
