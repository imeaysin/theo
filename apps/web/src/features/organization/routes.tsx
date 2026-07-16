import type { RouteObject } from "react-router-dom"
import { Navigate } from "react-router-dom"
import { organizationPlugin } from "@/lib/auth/organization-plugin"

const defaultOrgPath = organizationPlugin().viewPaths.organization.settings

export const organizationRoutes: RouteObject[] = [
  {
    path: "organization",
    children: [
      {
        index: true,
        element: <Navigate replace to={defaultOrgPath} />,
      },
      {
        path: ":path",
        async lazy() {
          const { OrganizationPage } =
            await import("@/features/organization/pages/organization-page")
          return { Component: OrganizationPage }
        },
      },
    ],
  },
]
