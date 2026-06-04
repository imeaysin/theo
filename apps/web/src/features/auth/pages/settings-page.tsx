import { useLocation } from "react-router-dom"
import { Settings } from "@workspace/hero-ui/better-auth-ui"

/**
 * Settings Page
 *
 * Complete user settings with tabbed navigation for:
 * - Account settings (profile, email)
 * - Security settings (password, linked accounts, sessions)
 *
 * Uses better-auth-ui's <Settings /> component which includes
 * all account and security management features.
 */
export function SettingsPage() {
  const location = useLocation()

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-muted">
          Manage your account settings and security preferences
        </p>
      </div>

      <Settings path={location.pathname} />
    </div>
  )
}
