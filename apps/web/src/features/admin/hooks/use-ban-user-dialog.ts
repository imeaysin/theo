"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useBanUser, type AdminListedUser } from "@workspace/auth/react"
import type { BanUserDialogProps } from "@workspace/ui/auth"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"
import { banUserSchema, type BanUserInput } from "@workspace/auth/forms"

export function useBanUserDialog() {
  const [open, setOpen] = useState(false)
  const [targetUser, setTargetUser] = useState<AdminListedUser | null>(null)
  const { mutateAsync: banUser, isPending } = useBanUser()

  const form = useForm<BanUserInput>({
    resolver: zodResolver(banUserSchema),
    defaultValues: { banReason: "" },
  })

  function openForUser(user: AdminListedUser) {
    setTargetUser(user)
    form.reset({ banReason: "" })
    setOpen(true)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setTargetUser(null)
      form.reset({ banReason: "" })
    }
    setOpen(nextOpen)
  }

  const dialogProps: BanUserDialogProps = {
    open,
    onOpenChange: handleOpenChange,
    control: form.control,
    userLabel: targetUser?.email ?? "This user",
    isPending,
    onSubmit: form.handleSubmit((values) => {
      if (!targetUser) return

      void toastManager
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
    }),
  }

  return {
    openForUser,
    dialogProps,
  }
}
