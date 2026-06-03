import { Outlet, useNavigate } from "react-router-dom"
import { authClient } from "@/lib/auth"
import { AuthProvider } from "@workspace/hero-ui/better-auth-ui"

export function RootLayout() {
  const navigate = useNavigate()

  return (
    <AuthProvider
      authClient={authClient}
      navigate={({ to, replace }: { to: string; replace?: boolean }) =>
        navigate(to, { replace })
      }
      socialProviders={["google"]}
    >
      <Outlet />
    </AuthProvider>
  )
}
