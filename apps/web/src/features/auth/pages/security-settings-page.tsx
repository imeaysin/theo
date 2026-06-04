import { SecuritySettings } from "@workspace/hero-ui/better-auth-ui"

/**
 * Security Settings Page
 *
 * Standalone security settings page with:
 * - Password change
 * - Linked social accounts management
 * - Active sessions management (sign out other devices)
 *
 * Can be used as a separate page or within Settings tabs
 */
export function SecuritySettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="mt-2 text-muted">
          Manage your password, linked accounts, and active sessions
        </p>
      </div>

      <SecuritySettings />
    </div>
  )
}
