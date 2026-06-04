import { useParams } from "react-router-dom"
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
 *
 * The `:tab` route param extracts just the path segment (e.g. "account", "security")
 * so the Settings component can match it against its view segments.
 */
export function SettingsPage() {
  const { tab } = useParams<{ tab?: string }>()
  const view = tab || "account"

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-muted">
          Manage your account settings and security preferences
        </p>
      </div>

      <Settings path={view} />
    </div>
  )
}
