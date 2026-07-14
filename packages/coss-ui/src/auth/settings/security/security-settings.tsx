"use client"

import { cn } from "@workspace/ui/lib/utils"
import type { ChangePasswordFormProps } from "./change-password"
import { ActiveSessions } from "./active-sessions"
import { ChangePassword } from "./change-password"
import { LinkedAccounts } from "./linked-accounts"

export type SecuritySettingsProps = {
  className?: string
  changePassword?: ChangePasswordFormProps
}

export function SecuritySettings({
  className,
  changePassword,
}: SecuritySettingsProps) {
  return (
    <div className={cn("flex w-full flex-col gap-4 md:gap-6", className)}>
      <ChangePassword changePassword={changePassword} />
      <LinkedAccounts />
      <ActiveSessions />
    </div>
  )
}
