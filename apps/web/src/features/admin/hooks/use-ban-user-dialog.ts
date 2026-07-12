import { useBanUser, type AdminListedUser } from "@workspace/auth/react"
import type { BanUserDialogProps } from "@workspace/ui-shadcn/auth"
import { useState } from "react"
import { toastManager } from "@workspace/ui-shadcn/components/toast"

export function useBanUserDialog() {
  const [open, setOpen] = useState(false)
  const [targetUser, setTargetUser] = useState<AdminListedUser | null>(null)
  const { mutateAsync: banUser } = useBanUser()

  function openForUser(user: AdminListedUser) {
    setTargetUser(user)
    setOpen(true)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setTargetUser(null)
    }
    setOpen(nextOpen)
  }

  const dialogProps: BanUserDialogProps = {
    open,
    onOpenChange: handleOpenChange,
    userLabel: targetUser?.email ?? "This user",
    onSubmit: async (values) => {
      if (!targetUser) return

      await toastManager
        .promise(
          banUser({
            userId: targetUser.id,
            banReason: values.banReason || undefined,
          }),
          {
            loading: {
              title: "Banning user…",
              description: "Revoking access for this account.",
              type: "loading",
            },
            success: {
              title: "User banned",
              description: "The user has been banned from the platform.",
              type: "success",
            },
            error: {
              title: "Could not ban user",
              description: "Please try again.",
              type: "error",
            },
          }
        )
        .then(() => handleOpenChange(false))
        .catch(() => undefined)
    },
  }

  return {
    openForUser,
    dialogProps,
  }
}
