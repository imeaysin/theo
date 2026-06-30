import type { RouteObject } from "react-router-dom"
import { SettingsPage } from "@/features/auth/pages/settings-page"
import { paths } from "@/config/paths"

export const accountRoutes: RouteObject[] = [
  { path: paths.auth.settings, element: <SettingsPage /> },
]
