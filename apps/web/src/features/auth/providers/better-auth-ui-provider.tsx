import "@/lib/auth/auth-plugin"
import { authClient } from "@workspace/auth/client"
import { useTheme } from "@workspace/ui-shadcn/components/theme-provider"
import { useQueryClient } from "@tanstack/react-query"
import { useMemo, type ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthProvider } from "@/features/auth/components/auth-provider"
import { useOrganizationRoles } from "@/features/organization/hooks/use-organization-roles"
import { formatRoleLabel } from "@/features/organization/lib/organization-roles"
import { apiKeyPlugin } from "@/lib/auth/api-key-plugin"
import { deleteUserPlugin } from "@/lib/auth/delete-user-plugin"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { themePlugin } from "@/lib/auth/theme-plugin"
import { defaultAuthenticatedRoute, routes } from "@/config/routes"

/** Better Auth UI context wired to the app auth client and React Router. */
export function BetterAuthUiProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: activeOrganization } = authClient.useActiveOrganization()
  const { data: customRoles } = useOrganizationRoles(activeOrganization?.id)

  const additionalRoles = useMemo(() => {
    const labels: Record<string, string> = {
      viewer: "Viewer",
    }
    for (const role of customRoles ?? []) {
      labels[role.role] = formatRoleLabel(role.role)
    }
    return labels
  }, [customRoles])

  return (
    <AuthProvider
      authClient={authClient}
      queryClient={queryClient}
      redirectTo={defaultAuthenticatedRoute}
      basePaths={{
        auth: "/auth",
        settings: routes.settings,
        organization: "/organization",
      }}
      emailAndPassword={{
        enabled: true,
        requireEmailVerification: true,
      }}
      socialProviders={["google", "github"]}
      navigate={({ to, replace }) => {
        void navigate(to, { replace })
      }}
      Link={({ href, to, ...props }) => (
        <Link to={href ?? to ?? "/"} {...props} />
      )}
      plugins={[
        organizationPlugin({ additionalRoles }),
        apiKeyPlugin({ organization: true }),
        themePlugin({ useTheme }),
        deleteUserPlugin(),
      ]}
    >
      {children}
    </AuthProvider>
  )
}
