import { createBrowserRouter, Link } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import { PageNotFound } from "@workspace/ui/components/page-not-found"
import { AuthLayout } from "@/components/layouts/auth-layout"
import { AppLayout } from "@/components/layouts/app-layout"
import { RootLayout } from "@/components/layouts/root-layout"
import { authRoutes } from "@/features/auth/routes"
import { dashboardRoutes } from "@/features/dashboard/routes"
import { homeRoutes } from "@/features/home/routes"
import { ProtectedRoute } from "@/routing/protected-route"
import { paths } from "@/config/paths"

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: homeRoutes,
  },
  {
    element: <AuthLayout />,
    children: authRoutes,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: dashboardRoutes,
      },
    ],
  },
  {
    path: "*",
    element: (
      <PageNotFound
        action={<Button render={<Link to={paths.home} />}>Go home</Button>}
      />
    ),
  },
])
