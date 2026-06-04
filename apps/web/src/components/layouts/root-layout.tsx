import { Outlet, useNavigate } from "react-router-dom"
import { authClient } from "@/lib/auth"
import { AuthProvider } from "@workspace/hero-ui/better-auth-ui"
import { ThemeProvider } from "@/providers/theme-provider"
import { paths } from "@/config/paths"

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
        redirectTo={`${window.location.origin}${paths.dashboard}`}
      >
        <Outlet />
      </AuthProvider>
    </ThemeProvider>
  )
}
