"use client"

import { cn } from "@workspace/ui/lib/utils"
import { ChangeEmail } from "./change-email"
import { UserProfile } from "./user-profile"

export interface AccountSettingsProps {
  className?: string
}

export function AccountSettings({ className }: AccountSettingsProps) {
  return (
    <div className={cn("flex w-full flex-col gap-4 md:gap-6", className)}>
      <UserProfile />
      <ChangeEmail />
    </div>
  )
}
