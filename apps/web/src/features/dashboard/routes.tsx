import type { RouteObject } from "react-router-dom"
import { AppLayout } from "@/components/layouts/app-layout"
import { ProtectedRoute } from "@/components/routing/protected-route"
import { paths } from "@/config/paths"

export const dashboardRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: paths.dashboard,
            lazy: async () => {
              const { DashboardPage } = await import("./pages/dashboard-page")
              return { Component: DashboardPage }
            },
          },
          {
            path: `${paths.settings.root}/:tab?`,
            lazy: async () => {
              const { SettingsPage } =
                await import("@/features/auth/pages/settings-page")
              return { Component: SettingsPage }
            },
          },
        ],
      },
    ],
  },
]
