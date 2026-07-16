import { createBrowserRouter, Link, Navigate, Outlet } from "react-router-dom"
import { Button } from "@workspace/ui-shadcn/components/button"
import { PageNotFound } from "@/components/page-not-found"
import { AppLayout } from "@/components/layouts/app-layout"
import { AuthLayout } from "@/components/layouts/auth-layout"
import { RootLayout } from "@/components/layouts/root-layout"
import { AcceptInvitationPage } from "@/features/auth/pages/accept-invitation-page"
import { BetterAuthUiProvider } from "@/features/auth/providers/better-auth-ui-provider"
import { authRoutes } from "@/features/auth/routes"
import { dashboardRoutes } from "@/features/dashboard/routes"
import { notesRoutes } from "@/features/notes/routes"
import { notificationRoutes } from "@/features/notifications/routes"
import { organizationRoutes } from "@/features/organization/routes"
import { uploadsRoutes } from "@/features/uploads/routes"
import { settingsRoutes } from "@/features/settings/routes"
import { homeRoutes } from "@/features/home/routes"
import { ProtectedRoute } from "@/routing/protected-route"
import { routeSegments, routes } from "@/config/routes"

function AuthUiLayout() {
  return (
    <BetterAuthUiProvider>
      <Outlet />
    </BetterAuthUiProvider>
  )
}

export const router = createBrowserRouter([
  {
    element: <AuthUiLayout />,
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
            element: <AppLayout />,
            children: [
              ...organizationRoutes,
              {
                path: routeSegments.app.root,
                children: [
                  {
                    index: true,
                    element: (
                      <Navigate replace to={routeSegments.app.dashboard} />
                    ),
                  },
                  ...dashboardRoutes,
                  ...notesRoutes,
                  ...notificationRoutes,
                  ...uploadsRoutes,
                  ...settingsRoutes,
                ],
              },
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
    ],
  },
])
