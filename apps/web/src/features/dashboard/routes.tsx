import type { RouteObject } from "react-router-dom"
import { dashboardMorePath } from "@/features/dashboard/dashboard-navigation"
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page"
import { MorePage } from "@/features/dashboard/pages/more-page"
import { paths } from "@/config/paths"

export const dashboardRoutes: RouteObject[] = [
  { path: paths.dashboard, element: <DashboardPage /> },
  { path: dashboardMorePath, element: <MorePage /> },
]
