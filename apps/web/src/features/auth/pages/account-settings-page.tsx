import { AccountSettings } from "@workspace/hero-ui/better-auth-ui"

/**
 * Account Settings Page
 *
 * Standalone account settings page with:
 * - User profile management (name, avatar)
 * - Email change with verification
 *
 * Can be used as a separate page or within Settings tabs
 */
export function AccountSettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="mt-2 text-muted">
          Update your profile information and email address
        </p>
      </div>

      <AccountSettings />
    </div>
  )
}
