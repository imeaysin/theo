import { Outlet, useNavigate } from "react-router-dom"
import { authClient } from "@/lib/auth"
import { BetterAuthProvider } from "@workspace/hero-ui/better-auth-ui"

export function RootLayout() {
  const navigate = useNavigate()

  return (
    <BetterAuthProvider
      authClient={authClient}
      navigate={({ to, replace }: { to: string; replace?: boolean }) =>
        navigate(to, { replace })
      }
      socialProviders={["google"]}
    >
      <Outlet />
    </BetterAuthProvider>
  )
}
