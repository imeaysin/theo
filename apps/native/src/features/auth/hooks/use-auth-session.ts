import { useEffect } from "react"
import { refreshAccessToken } from "@workspace/auth/expo-client"
import { authClient, tokenStorage } from "@/lib/auth"

export function useAuthSession() {
  const { data: session, isPending, error } = authClient.useSession()

  useEffect(() => {
    if (!session?.user) return
    void refreshAccessToken(authClient, tokenStorage).catch(() => {})
  }, [session?.user?.id])

  return {
    session,
    isPending,
    isError: !!error,
    error,
    isAuthenticated: !!session?.user,
  }
}
