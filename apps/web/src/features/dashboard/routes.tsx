import type { RouteObject } from "react-router-dom"
import { dashboardSectionPaths } from "@/config/app-navigation"
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page"
import { DashboardSectionPage } from "@/features/dashboard/pages/dashboard-section-page"
import { paths } from "@/config/paths"

export const dashboardRoutes: RouteObject[] = [
  { path: paths.dashboard, element: <DashboardPage /> },
  ...dashboardSectionPaths.map((section) => ({
    path: `${paths.dashboard}/${section}`,
    element: <DashboardSectionPage />,
  })),
]
