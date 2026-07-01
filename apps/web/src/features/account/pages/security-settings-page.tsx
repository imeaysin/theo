"use client"

import { Settings } from "@workspace/ui/auth"
import { ShellMain } from "@workspace/ui/components/shell"

export function SecuritySettingsPage() {
  return (
    <ShellMain heading="Account" subtitle="Manage your account settings.">
      <Settings view="security" />
    </ShellMain>
  )
}
