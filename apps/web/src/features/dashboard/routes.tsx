import type { RouteObject } from "react-router-dom"
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page"
import { paths } from "@/config/paths"

export const dashboardRoutes: RouteObject[] = [
  { path: paths.dashboard, element: <DashboardPage /> },
]
