import { createBrowserRouter } from "react-router-dom"
import { RootLayout } from "@/components/layouts/root-layout"
import { adminRoutes } from "@/features/admin/routes"
import { authRoutes } from "@/features/auth/routes"
import { dashboardRoutes } from "@/features/dashboard/routes"
import { homeRoutes } from "@/features/home/routes"

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      ...homeRoutes,
      ...authRoutes,
      ...dashboardRoutes,
      ...adminRoutes,
    ],
  },
])
