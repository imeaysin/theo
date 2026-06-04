import { SignOut } from "@workspace/hero-ui/better-auth-ui"

/**
 * Sign Out Page
 *
 * Automatically signs the user out when mounted.
 * Shows a centered loading indicator during the sign-out process.
 */
export function SignOutPage() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <SignOut />
    </div>
  )
}
