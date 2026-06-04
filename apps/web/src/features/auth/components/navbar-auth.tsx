import { UserButton } from "@workspace/hero-ui/better-auth-ui"
import { useAuthSession } from "../hooks"
import { AuthButtons, AuthButtonsMobile } from "./auth-buttons"
import { paths } from "@/config/paths"

/**
 * Navbar authentication UI
 *
 * Shows:
 * - Loading skeleton while checking auth status
 * - UserButton with dropdown when authenticated
 * - Sign In / Sign Up buttons when not authenticated
 *
 * Desktop version with horizontal layout
 */
export function NavbarAuth() {
  const { session, isPending } = useAuthSession()

  if (isPending) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-muted/30" />
  }

  if (session?.user) {
    return (
      <UserButton
        links={[
          {
            label: "Dashboard",
            href: paths.dashboard,
            visibility: "authenticated",
          },
        ]}
      />
    )
  }

  return <AuthButtons />
}

/**
 * Mobile navbar authentication UI
 *
 * Shows:
 * - UserButton icon when authenticated
 * - Nothing when not authenticated (mobile menu shows buttons instead)
 */
export function NavbarAuthMobile() {
  const { session, isPending } = useAuthSession()

  if (isPending || !session?.user) {
    return null
  }

  return <UserButton size="icon" />
}

/**
 * Mobile menu authentication section
 *
 * Shows Sign In / Sign Up buttons in mobile menu
 * when user is not authenticated
 */
export function MobileMenuAuth() {
  const { session, isPending } = useAuthSession()

  if (isPending || session?.user) {
    return null
  }

  return <AuthButtonsMobile />
}
