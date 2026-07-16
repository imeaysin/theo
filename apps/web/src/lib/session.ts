import { useSession } from "@workspace/auth/client"

export function useActiveOrganizationId() {
  const { data: session } = useSession()
  return session?.session.activeOrganizationId ?? null
}
