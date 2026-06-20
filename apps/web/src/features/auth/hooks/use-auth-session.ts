import { useSession } from "@workspace/auth/react"
import { authClient } from "@/lib/auth"

/**
 * Hook to access the current authentication session
 *
 * Wraps better-auth-ui's useSession with the app's authClient
 * so components don't need to import authClient directly.
 * Refreshes JWT access tokens for API calls (Bearer/JWT, not cookies).
 */
export function useAuthSession() {
  const { data: session, isPending, isError, error } = useSession(authClient)

  return {
    session,
    isPending,
    isError,
    error,
    isAuthenticated: !!session?.user,
  }
}
