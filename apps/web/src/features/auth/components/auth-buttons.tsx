import { Link } from "react-router-dom"
import { Button } from "@workspace/hero-ui"
import { paths } from "@/config/paths"

/**
 * Sign In and Sign Up buttons for unauthenticated users
 *
 * Shows ghost Sign In button and primary Sign Up button
 * Typically used in navbar for logged-out state
 */
export function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <Link to={paths.auth.signIn}>
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
      </Link>
      <Link to={paths.auth.signUp}>
        <Button variant="primary" size="sm">
          Sign Up
        </Button>
      </Link>
    </div>
  )
}

/**
 * Full-width auth buttons for mobile menu
 */
export function AuthButtonsMobile() {
  return (
    <div className="border-separator flex flex-col gap-2 border-t pt-4">
      <Link to={paths.auth.signIn} className="w-full">
        <Button variant="ghost" className="w-full">
          Sign In
        </Button>
      </Link>
      <Link to={paths.auth.signUp} className="w-full">
        <Button variant="primary" className="w-full">
          Sign Up
        </Button>
      </Link>
    </div>
  )
}
