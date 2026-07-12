import { Settings } from "@workspace/ui-shadcn/auth"
import { useChangePasswordForm } from "@/features/auth/hooks/use-change-password-form"

export function SecuritySettingsPage() {
  const changePassword = useChangePasswordForm()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Security</h2>
        <p className="text-muted-foreground">
          Manage your password and security settings.
        </p>
      </div>
      <Settings security={{ changePassword }} view="security" />
    </div>
  )
}
