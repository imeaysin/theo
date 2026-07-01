import { Navigate } from "react-router-dom"
import type { RouteObject } from "react-router-dom"
import { routes, routeSegments } from "@/config/routes"
import { OrganizationPeoplePage } from "@/features/organization/pages/organization-people-page"
import { OrganizationSettingsPage } from "@/features/organization/pages/organization-settings-page"

export const organizationRoutes: RouteObject[] = [
  {
    path: routeSegments.app.organization,
    children: [
      {
        index: true,
        element: <Navigate replace to={routes.organizationSettings} />,
      },
      { path: "settings", element: <OrganizationSettingsPage /> },
      { path: "people", element: <OrganizationPeoplePage /> },
      {
        path: "*",
        element: <Navigate replace to={routes.organizationSettings} />,
      },
    ],
  },
]
