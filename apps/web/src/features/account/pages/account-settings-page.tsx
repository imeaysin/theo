import { Settings } from "@workspace/ui/auth"
import { ShellMain } from "@workspace/ui/components/shell"
import { ApiProfileCard } from "@/features/account/components/api-profile-card"
import { useChangeEmailForm } from "@/features/auth/hooks/use-change-email-form"
import { useUserProfileForm } from "@/features/auth/hooks/use-user-profile-form"

export function AccountSettingsPage() {
  const profile = useUserProfileForm()
  const changeEmail = useChangeEmailForm()

  return (
    <ShellMain
      header={{
        heading: "Account",
        subtitle: "Manage your account settings.",
      }}
    >
      <div className="flex flex-col gap-6">
        <Settings account={{ profile, changeEmail }} view="account" />
        <ApiProfileCard />
      </div>
    </ShellMain>
  )
}
