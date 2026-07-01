import { Navigate } from "react-router-dom"
import type { RouteObject } from "react-router-dom"
import { routes } from "@/config/routes"
import { routeSegments } from "@/config/routes"
import { AccountSettingsPage } from "@/features/account/pages/account-settings-page"
import { SecuritySettingsPage } from "@/features/account/pages/security-settings-page"

export const accountRoutes: RouteObject[] = [
  {
    path: routeSegments.app.settings,
    children: [
      {
        index: true,
        element: <Navigate replace to={routes.settingsAccount} />,
      },
      { path: "account", element: <AccountSettingsPage /> },
      { path: "security", element: <SecuritySettingsPage /> },
      {
        path: "*",
        element: <Navigate replace to={routes.settingsAccount} />,
      },
    ],
  },
]
