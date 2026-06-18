import { useEffect } from "react"
import { SignOut } from "@workspace/hero-ui/better-auth-ui"
import { tokenStorage } from "@/lib/auth"

/**
 * Sign Out Page
 *
 * Clears stored tokens and signs the user out via Better Auth.
 */
export function SignOutPage() {
  useEffect(() => {
    tokenStorage.clearAll()
  }, [])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <SignOut />
    </div>
  )
}
