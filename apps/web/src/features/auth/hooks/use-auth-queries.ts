import {
  useUser,
  useListAccounts,
  useListSessions,
} from "@workspace/hero-ui/better-auth-ui"
import { authClient } from "@/lib/auth"

/**
 * Auth Query Hooks
 *
 * Pre-configured query hooks that wrap better-auth-ui queries
 * with the app's authClient, so components don't need to import it.
 */

/**
 * Get current authenticated user
 */
export function useAuthUser() {
  const { data: user, isPending, isError, error } = useUser(authClient)

  return {
    user,
    isPending,
    isError,
    error,
  }
}

/**
 * Get list of linked social accounts
 */
export function useAuthLinkedAccounts() {
  const {
    data: accounts,
    isPending,
    isError,
    error,
  } = useListAccounts(authClient)

  return {
    accounts: accounts ?? [],
    isPending,
    isError,
    error,
  }
}

/**
 * Get list of active sessions (devices)
 */
export function useAuthSessions() {
  const {
    data: sessions,
    isPending,
    isError,
    error,
  } = useListSessions(authClient)

  return {
    sessions: sessions ?? [],
    isPending,
    isError,
    error,
  }
}
