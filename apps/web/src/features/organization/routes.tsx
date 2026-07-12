import { Navigate } from "react-router-dom"
import type { RouteObject } from "react-router-dom"
import { organizationUiPermissions } from "@workspace/ui-shadcn/auth"
import { routes, routeSegments } from "@/config/routes"
import { OrganizationPermissionRoute } from "@/routing/organization-permission-route"

export const organizationRoutes: RouteObject[] = [
  {
    path: routeSegments.app.organization,
    children: [
      {
        index: true,
        element: <Navigate replace to={routes.organizationSettings} />,
      },
      {
        path: "settings",
        async lazy() {
          const { OrganizationSettingsPage } =
            await import("@/features/organization/pages/organization-settings-page")
          return { Component: OrganizationSettingsPage }
        },
      },
      {
        path: "people",
        async lazy() {
          const { OrganizationPeoplePage } =
            await import("@/features/organization/pages/organization-people-page")
          return { Component: OrganizationPeoplePage }
        },
      },
      {
        element: (
          <OrganizationPermissionRoute
            permission={organizationUiPermissions.listRoles}
          />
        ),
        children: [
          {
            path: "roles",
            async lazy() {
              const { OrganizationRolesPage } =
                await import("@/features/organization/pages/organization-roles-page")
              return { Component: OrganizationRolesPage }
            },
          },
        ],
      },
      {
        path: "*",
        element: <Navigate replace to={routes.organizationSettings} />,
      },
    ],
  },
]
