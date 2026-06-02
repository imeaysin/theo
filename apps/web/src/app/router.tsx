import { createBrowserRouter } from "react-router-dom"
import { RootLayout } from "@/components/layouts/root-layout"
import { authRoutes } from "@/features/auth/routes"
import { dashboardRoutes } from "@/features/dashboard/routes"
import { homeRoutes } from "@/features/home/routes"
import { heroUIDemoRoutes } from "@/features/hero-ui-demo/routes"

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      ...homeRoutes,
      ...authRoutes,
      ...dashboardRoutes,
      ...heroUIDemoRoutes,
    ],
  },
])
