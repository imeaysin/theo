import type { RouteObject } from "react-router-dom"
import { SettingsPage } from "@/features/account/pages/settings-page"
import { paths } from "@/config/paths"

export const accountRoutes: RouteObject[] = [
  { path: paths.account.settings, element: <SettingsPage /> },
  { path: paths.account.outOfOffice, element: <SettingsPage /> },
]
