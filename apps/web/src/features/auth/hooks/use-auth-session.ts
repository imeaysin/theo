import { useSession } from "@workspace/hero-ui/better-auth-ui"
import { authClient } from "@/lib/auth"

/**
 * Hook to access the current authentication session
 *
 * Wraps better-auth-ui's useSession with the app's authClient
 * so components don't need to import authClient directly.
 *
 * @example
 * ```tsx
 * const { session, isPending } = useAuthSession()
 *
 * if (isPending) return <Skeleton />
 * if (!session) return <SignInButton />
 * return <UserProfile user={session.user} />
 * ```
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
