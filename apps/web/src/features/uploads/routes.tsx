import type { RouteObject } from "react-router-dom"
import { UploadsPage } from "@/features/uploads/pages/uploads-page"
import { routeSegments } from "@/config/routes"

export const uploadsRoutes: RouteObject[] = [
  { path: routeSegments.app.uploads, element: <UploadsPage /> },
]
