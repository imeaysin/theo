import { Settings } from "@workspace/ui/auth"
import { ShellMain } from "@workspace/ui/components/shell"
import { useChangePasswordForm } from "@/features/auth/hooks/use-change-password-form"

export function SecuritySettingsPage() {
  const changePassword = useChangePasswordForm()

  return (
    <ShellMain
      header={{
        heading: "Security",
        subtitle: "Manage your password, linked accounts, and sessions.",
      }}
    >
      <Settings security={{ changePassword }} view="security" />
    </ShellMain>
  )
}
