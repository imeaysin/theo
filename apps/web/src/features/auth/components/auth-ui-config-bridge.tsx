import { Link, useNavigate } from "react-router-dom"
import { AuthUiConfigProvider } from "@workspace/auth/react"
import {
  absoluteAppUrl,
  defaultAuthenticatedRoute,
  routes,
} from "@/config/routes"
import { site } from "@/config/site"

export function AuthUiConfigBridge({
  children,
}: {
  children: React.ReactNode
}) {
  const navigate = useNavigate()

  return (
    <AuthUiConfigProvider
      Link={({ to, href, className, children: linkChildren }) => (
        <Link className={className} to={to ?? href ?? "#"}>
          {linkChildren}
        </Link>
      )}
      absoluteAppUrl={absoluteAppUrl}
      navigate={(to, options) => navigate(to, { replace: options?.replace })}
      routes={{
        signIn: routes.signIn,
        signUp: routes.signUp,
        signOut: routes.signOut,
        forgotPassword: routes.forgotPassword,
        resetPassword: routes.resetPassword,
        verifyEmail: routes.verifyEmail,
        twoFactor: routes.twoFactor,
        settingsAccount: routes.settingsAccount,
        settingsSecurity: routes.settingsSecurity,
        organizationSettings: routes.organizationSettings,
        organizationPeople: routes.organizationPeople,
        organizationRoles: routes.organizationRoles,
        adminUsers: routes.adminUsers,
        defaultAuthenticated: defaultAuthenticatedRoute,
      }}
      siteName={site.name}
    >
      {children}
    </AuthUiConfigProvider>
  )
}
