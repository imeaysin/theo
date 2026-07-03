import type { RouteObject } from "react-router-dom"
import { NotificationsPage } from "@/features/notifications/pages/notifications-page"
import { routeSegments } from "@/config/routes"

export const notificationRoutes: RouteObject[] = [
  { path: routeSegments.app.notifications, element: <NotificationsPage /> },
]
