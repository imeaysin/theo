import type { RouteObject } from "react-router-dom"
import { Navigate } from "react-router-dom"
import { routeSegments } from "@/config/routes"

export const settingsRoutes: RouteObject[] = [
  {
    path: routeSegments.app.settings,
    children: [
      {
        index: true,
        element: <Navigate replace to="account" />,
      },
      {
        path: ":view",
        async lazy() {
          const { SettingsPage } =
            await import("@/features/settings/pages/settings-page")
          return { Component: SettingsPage }
        },
      },
    ],
  },
]
