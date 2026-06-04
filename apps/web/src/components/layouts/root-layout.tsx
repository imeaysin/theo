import { Outlet, useNavigate } from "react-router-dom"
import { authClient } from "@/lib/auth"
import { AuthProvider } from "@workspace/hero-ui/better-auth-ui"
import { ThemeProvider } from "@/providers/theme-provider"

export function RootLayout() {
  const navigate = useNavigate()

  return (
    <ThemeProvider>
      <AuthProvider
        authClient={authClient}
        navigate={({ to, replace }: { to: string; replace?: boolean }) =>
          navigate(to, { replace })
        }
        socialProviders={["google"]}
      >
        <Outlet />
      </AuthProvider>
    </ThemeProvider>
  )
}
