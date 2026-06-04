import { Outlet, useNavigate } from "react-router-dom"
import { authClient } from "@/lib/auth"
import {
  AuthProvider,
  themePlugin,
} from "@workspace/hero-ui/better-auth-ui"
import { ThemeProvider, useTheme } from "@/providers/theme-provider"
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
        plugins={[
          themePlugin({
            useTheme: () => {
              const { theme, setTheme } = useTheme()
              return { theme, setTheme }
            },
          }),
        ]}
      >
        <Outlet />
      </AuthProvider>
    </ThemeProvider>
  )
}
