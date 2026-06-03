import { Outlet, useNavigate } from "react-router-dom"
import { AuthProvider } from "@workspace/hero-ui/better-auth-ui"
import { authClient } from "@/lib/auth"

export function RootLayout() {
  const navigate = useNavigate()

  return (
    <AuthProvider
      authClient={authClient}
      navigate={({ to, replace }) => navigate(to, { replace })}
    >
      <Outlet />
    </AuthProvider>
  )
}
