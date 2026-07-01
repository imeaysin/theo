"use client"

import { cn } from "@workspace/ui/lib/utils"
import { ChangeEmail, type ChangeEmailProps } from "./change-email"
import { UserProfile, type UserProfileProps } from "./user-profile"

export interface AccountSettingsProps {
  className?: string
  profile?: UserProfileProps
  changeEmail?: ChangeEmailProps
}

export function AccountSettings({
  className,
  profile,
  changeEmail,
}: AccountSettingsProps) {
  return (
    <div className={cn("flex w-full flex-col gap-4 md:gap-6", className)}>
      <UserProfile {...profile} />
      <ChangeEmail {...changeEmail} />
    </div>
  )
}
