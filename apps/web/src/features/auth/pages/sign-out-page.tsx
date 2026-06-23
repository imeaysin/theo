import { useEffect } from "react"
import { useAuthSignOut } from "@/features/auth/hooks/use-auth-mutations"
import { tokenStorage } from "@/lib/auth"
import { paths } from "@/config/paths"

/**
 * Sign Out Page
 *
 * Clears stored tokens and signs the user out via Better Auth.
 */
export function SignOutPage() {
  const { mutateAsync: signOut } = useAuthSignOut()

  useEffect(() => {
    let isMounted = true

    const doSignOut = async () => {
      try {
        tokenStorage.clearAll()
        await signOut()
      } catch (err) {
        // Ignore error
      } finally {
        if (isMounted) {
          window.location.href = paths.home
        }
      }
    }

    void doSignOut()

    return () => {
      isMounted = false
    }
  }, [signOut])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        <p className="text-sm text-muted-foreground">Signing out...</p>
      </div>
    </div>
  )
}
