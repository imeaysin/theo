import { Outlet, useNavigate } from "react-router-dom"
import { authClient } from "@/lib/auth"
import { AuthProvider } from "@workspace/hero-ui/better-auth-ui"
import { Toast } from "@workspace/hero-ui"
import { ThemeProvider } from "@/providers/theme-provider"
import { paths } from "@/config/paths"

export function RootLayout() {
  const navigate = useNavigate()

  return (
    <ThemeProvider>
      <AuthProvider
        baseURL={window.location.origin}
        authClient={authClient}
        navigate={({ to, replace }: { to: string; replace?: boolean }) =>
          navigate(to, { replace })
        }
        socialProviders={["google"]}
        redirectTo={paths.dashboard}
        emailAndPassword={{
          requireEmailVerification: true,
        }}
        localization={{
          auth: {
            verifyYourEmail: "Check your email for the verification link",
          },
        }}
      >
        <Outlet />
      </AuthProvider>

      <Toast.Provider />
    </ThemeProvider>
  )
}
