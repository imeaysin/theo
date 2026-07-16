import { useEffect, useRef } from "react"
import { authClient, useSession } from "@workspace/auth/client"
import { toast } from "sonner"
import { toOrganizationSlug } from "@/features/shell/organization-slug"

/**
 * Notes/uploads require Better Auth `session.activeOrganizationId`.
 * Ensures the signed-in user has an active organization (creates one if needed).
 */
export function useEnsureActiveOrganization() {
  const { data: session, isPending: sessionPending } = useSession()
  const { data: organizations, isPending: orgsPending } =
    authClient.useListOrganizations()
  const ensuringRef = useRef(false)

  useEffect(() => {
    if (sessionPending || orgsPending || !session?.user) return

    const activeOrganizationId = session.session.activeOrganizationId ?? null
    if (activeOrganizationId) return
    if (ensuringRef.current) return

    const user = session.user
    const orgs = organizations ?? []

    async function ensure() {
      ensuringRef.current = true
      try {
        if (orgs.length > 0) {
          const first = orgs[0]
          if (!first?.id) return
          const result = await authClient.organization.setActive({
            organizationId: first.id,
          })
          if (result.error) {
            toast.error(
              result.error.message ?? "Could not activate organization"
            )
          }
          return
        }

        const seed =
          user.name?.trim() || user.email?.split("@")[0] || "organization"
        const name = `${seed}'s Organization`
        const slug = `${toOrganizationSlug(seed)}-${Date.now().toString(36)}`

        const created = await authClient.organization.create({
          name,
          slug,
        })
        if (created.error) {
          toast.error(created.error.message ?? "Could not create organization")
          return
        }

        const organizationId = created.data?.id
        if (!organizationId) return

        const activated = await authClient.organization.setActive({
          organizationId,
        })
        if (activated.error) {
          toast.error(
            activated.error.message ?? "Could not activate organization"
          )
        }
      } finally {
        ensuringRef.current = false
      }
    }

    void ensure()
  }, [session, sessionPending, organizations, orgsPending])
}
