import { Settings } from "@workspace/ui-shadcn/auth"
import { useChangeEmailForm } from "@/features/auth/hooks/use-change-email-form"
import { useUserProfileForm } from "@/features/auth/hooks/use-user-profile-form"

export function AccountSettingsPage() {
  const profile = useUserProfileForm()
  const changeEmail = useChangeEmailForm()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Account</h2>
        <p className="text-muted-foreground">
          Manage your account settings and profile.
        </p>
      </div>
      <Settings account={{ profile, changeEmail }} view="account" />
    </div>
  )
}
