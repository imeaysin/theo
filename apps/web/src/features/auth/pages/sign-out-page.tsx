import { SignOut } from "@workspace/hero-ui/better-auth-ui"

/**
 * Sign Out Page
 *
 * Automatically signs the user out when mounted.
 * Shows a loading indicator during the sign-out process.
 */
export function SignOutPage() {
  return (
    <div className="container mx-auto max-w-md py-8">
      <SignOut />
    </div>
  )
}
