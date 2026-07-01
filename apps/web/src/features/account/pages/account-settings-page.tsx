"use client"

import { Settings } from "@workspace/ui/auth"
import { ShellMain } from "@workspace/ui/components/shell"
import { useChangeEmailForm } from "@/features/auth/hooks/use-change-email-form"
import { useUserProfileForm } from "@/features/auth/hooks/use-user-profile-form"

export function AccountSettingsPage() {
  const profile = useUserProfileForm()
  const changeEmail = useChangeEmailForm()

  return (
    <ShellMain heading="Account" subtitle="Manage your account settings.">
      <Settings account={{ profile, changeEmail }} view="account" />
    </ShellMain>
  )
}
