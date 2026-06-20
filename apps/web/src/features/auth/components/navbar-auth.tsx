import { Link, useNavigate } from "react-router-dom"
import { LayoutDashboard, Settings } from "lucide-react"
import { useAuthSession } from "../hooks"
import { useAuthSignOut } from "../hooks/use-auth-mutations"
import { AuthButtons, AuthButtonsMobile } from "./auth-buttons"
import { UserButton } from "@workspace/ui/components/auth/user-button"
import { MenuItem } from "@workspace/ui/components/menu"
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
  const { mutateAsync: signOut } = useAuthSignOut()
  const navigate = useNavigate()

  if (isPending) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-muted/30" />
  }

  if (session?.user) {
    return (
      <UserButton
        user={{
          name: session.user.name || "User",
          email: session.user.email,
          avatar: session.user.image || undefined,
        }}
        onSignOut={async () => {
          await signOut()
          navigate(paths.home)
        }}
      >
        <MenuItem render={<Link to={paths.dashboard} />}>
          <LayoutDashboard className="mr-2 size-4" />
          Dashboard
        </MenuItem>
        <MenuItem render={<Link to={paths.settings.root} />}>
          <Settings className="mr-2 size-4" />
          Settings
        </MenuItem>
      </UserButton>
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
  const { mutateAsync: signOut } = useAuthSignOut()
  const navigate = useNavigate()

  if (isPending || !session?.user) {
    return null
  }

  return (
    <UserButton
      user={{
        name: session.user.name || "User",
        email: session.user.email,
        avatar: session.user.image || undefined,
      }}
      onSignOut={async () => {
        await signOut()
        navigate(paths.home)
      }}
    >
      <MenuItem render={<Link to={paths.dashboard} />}>
        <LayoutDashboard className="mr-2 size-4" />
        Dashboard
      </MenuItem>
      <MenuItem render={<Link to={paths.settings.root} />}>
        <Settings className="mr-2 size-4" />
        Settings
      </MenuItem>
    </UserButton>
  )
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
