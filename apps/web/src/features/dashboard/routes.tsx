import type { RouteObject } from "react-router-dom"
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page"
import { routeSegments } from "@/config/routes"

export const dashboardRoutes: RouteObject[] = [
  { path: routeSegments.app.dashboard, element: <DashboardPage /> },
]
