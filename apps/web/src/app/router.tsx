import { createBrowserRouter, Link, Navigate } from "react-router-dom"
import { Button } from "@workspace/ui-shadcn/components/button"
import { PageNotFound } from "@/components/page-not-found"
import { AppLayout } from "@/components/layouts/app-layout"
import { AuthLayout } from "@/components/layouts/auth-layout"
import { RootLayout } from "@/components/layouts/root-layout"
import { AcceptInvitationPage } from "@/features/auth/pages/accept-invitation-page"
import { authRoutes } from "@/features/auth/routes"
import { dashboardRoutes } from "@/features/dashboard/routes"
import { notesRoutes } from "@/features/notes/routes"
import { notificationRoutes } from "@/features/notifications/routes"
import { uploadsRoutes } from "@/features/uploads/routes"
import { homeRoutes } from "@/features/home/routes"
import { ProtectedRoute } from "@/routing/protected-route"
import { routeSegments, routes } from "@/config/routes"

export const router = createBrowserRouter([
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
    element: <AuthLayout />,
    children: [
      {
        path: `${routeSegments.acceptInvitation.root}/${routeSegments.acceptInvitation.invitationId}`,
        element: <AcceptInvitationPage />,
      },
    ],
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
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <PageNotFound
        action={
          <Button nativeButton={false} render={<Link to={routes.home} />}>
            Go home
          </Button>
        }
      />
    ),
  },
])
