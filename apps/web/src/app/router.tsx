import { createBrowserRouter, Link, Navigate } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import { PageNotFound } from "@workspace/ui/components/page-not-found"
import { AuthLayout } from "@/components/layouts/auth-layout"
import { AppLayout } from "@/components/layouts/app-layout"
import { RootLayout } from "@/components/layouts/root-layout"
import { RouterLayout } from "@/components/layouts/router-layout"
import { accountRoutes } from "@/features/account/routes"
import { AcceptInvitationPage } from "@/features/auth/pages/accept-invitation-page"
import { authRoutes } from "@/features/auth/routes"
import { dashboardRoutes } from "@/features/dashboard/routes"
import { notesRoutes } from "@/features/notes/routes"
import { notificationRoutes } from "@/features/notifications/routes"
import { uploadsRoutes } from "@/features/uploads/routes"
import { organizationRoutes } from "@/features/organization/routes"
import { adminRoutes } from "@/features/admin/routes"
import { homeRoutes } from "@/features/home/routes"
import { ProtectedRoute } from "@/routing/protected-route"
import { AdminRoute } from "@/routing/admin-route"
import { routeSegments, routes } from "@/config/routes"

export const router = createBrowserRouter([
  {
    element: <RouterLayout />,
    children: [
      {
        element: <RootLayout />,
        children: homeRoutes,
      },
      {
        path: routeSegments.auth.root,
        element: <AuthLayout />,
        children: authRoutes,
      },
      {
        path: routes.acceptInvitation,
        element: <AuthLayout />,
        children: [{ index: true, element: <AcceptInvitationPage /> }],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: routeSegments.app.root,
            element: <AppLayout />,
            children: [
              {
                index: true,
                element: <Navigate replace to={routeSegments.app.dashboard} />,
              },
              ...dashboardRoutes,
              ...notesRoutes,
              ...notificationRoutes,
              ...uploadsRoutes,
              ...accountRoutes,
              ...organizationRoutes,
              {
                element: <AdminRoute />,
                children: adminRoutes,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: (
          <PageNotFound
            action={<Button render={<Link to={routes.home} />}>Go home</Button>}
          />
        ),
      },
    ],
  },
])
