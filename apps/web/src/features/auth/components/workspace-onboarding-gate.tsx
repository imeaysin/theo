import {
  useListOrganizations,
  useAuthSession,
  useSetActiveOrganization,
  useSignOut,
} from "@workspace/auth/react"
import { WorkspaceOnboarding } from "@workspace/ui-shadcn/auth"
import { PageLoading } from "@workspace/ui-shadcn/components/page-loading"
import { useEffect, useRef, type ReactNode } from "react"
import { Link as RouterLink } from "react-router-dom"
import { useWorkspaceOnboarding } from "@/features/auth/hooks/use-workspace-onboarding"
import { routes } from "@/config/routes"

export function WorkspaceOnboardingGate({ children }: { children: ReactNode }) {
  const { data: session, isPending: sessionPending } = useAuthSession()
  const { data: organizations, isPending: organizationsPending } =
    useListOrganizations()
  const { mutate: setActiveOrganization } = useSetActiveOrganization()
  const signOut = useSignOut()
  const onboarding = useWorkspaceOnboarding()
  const didSyncActiveOrganization = useRef(false)

  const activeOrganizationId = session?.session.activeOrganizationId

  useEffect(() => {
    if (didSyncActiveOrganization.current) return
    if (!session || activeOrganizationId || !organizations?.length) return

    const firstOrganization = organizations[0]
    if (!firstOrganization?.id) return

    didSyncActiveOrganization.current = true
    setActiveOrganization({ organizationId: firstOrganization.id })
  }, [activeOrganizationId, organizations, session, setActiveOrganization])

  if (sessionPending || organizationsPending) {
    return <PageLoading />
  }

  if (session && organizations && organizations.length === 0) {
    return (
      <WorkspaceOnboarding
        {...onboarding.props}
        homeHref={routes.home}
        linkComponent={({ href, className, children: linkChildren }) => (
          <RouterLink className={className} to={href}>
            {linkChildren}
          </RouterLink>
        )}
        onSignOut={() => signOut.mutate()}
      />
    )
  }

  return children
}
