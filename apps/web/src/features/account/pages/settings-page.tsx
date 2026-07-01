"use client"

import { Navigate, useParams } from "react-router-dom"
import { Settings, type SettingsView } from "@workspace/ui/auth"
import { ShellMain } from "@workspace/ui/components/shell"
import { routes } from "@/config/routes"
import { useChangeEmailForm } from "@/features/auth/hooks/use-change-email-form"
import { useUserProfileForm } from "@/features/auth/hooks/use-user-profile-form"

function isSettingsView(value: string | undefined): value is SettingsView {
  return value === "account" || value === "security"
}

export function SettingsPage() {
  const { section } = useParams<{ section?: string }>()
  const profile = useUserProfileForm()
  const changeEmail = useChangeEmailForm()

  if (!section) {
    return <Navigate replace to={routes.settingsAccount} />
  }

  if (!isSettingsView(section)) {
    return <Navigate replace to={routes.settingsAccount} />
  }

  return (
    <ShellMain heading="Account" subtitle="Manage your account settings.">
      <div className="max-w-2xl">
        <Settings account={{ profile, changeEmail }} view={section} />
      </div>
    </ShellMain>
  )
}
