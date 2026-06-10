import type { RouteObject } from "react-router-dom"
import { AdminRoute } from "./components/admin-route"
import { AdminLayout } from "./components/admin-layout"
import { paths } from "@/config/paths"

export const adminRoutes: RouteObject[] = [
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: paths.admin.dashboard,
            lazy: async () => {
              const { AdminDashboardPage } =
                await import("./pages/admin-dashboard-page")
              return { Component: AdminDashboardPage }
            },
          },
          {
            path: paths.admin.users,
            lazy: async () => {
              const { AdminUsersPage } =
                await import("./pages/admin-users-page")
              return { Component: AdminUsersPage }
            },
          },
          {
            path: paths.admin.settings,
            lazy: async () => {
              const { AdminSettingsPage } =
                await import("./pages/admin-settings-page")
              return { Component: AdminSettingsPage }
            },
          },
        ],
      },
    ],
  },
]
