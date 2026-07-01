import type { RouteObject } from "react-router-dom"
import { OrganizationPage } from "@/features/organization/pages/organization-page"

export const organizationRoutes: RouteObject[] = [
  {
    path: "organization",
    children: [
      { index: true, element: <OrganizationPage /> },
      { path: ":section", element: <OrganizationPage /> },
    ],
  },
]
