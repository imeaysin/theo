"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  useAssignableOrganizationRoles,
  useInviteMember,
} from "@workspace/auth/react"
import type { InviteMemberDialogProps } from "@workspace/ui/auth"
import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"
import {
  inviteMemberSchema,
  type InviteMemberInput,
} from "@/features/auth/schemas"

export function useInviteMemberDialog() {
  const [open, setOpen] = useState(false)
  const {
    roles,
    formatOrganizationRoleLabel,
    isPending: rolesPending,
  } = useAssignableOrganizationRoles()
  const { mutate: inviteMember, isPending } = useInviteMember()

  const defaultRole = roles.includes("member")
    ? "member"
    : (roles.at(-1) ?? "member")

  const form = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: "", role: defaultRole },
  })

  const email = useWatch({ control: form.control, name: "email" })
  const role = useWatch({ control: form.control, name: "role" })

  useEffect(() => {
    if (!open) return
    form.reset({ email: "", role: defaultRole })
  }, [defaultRole, form, open])

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset({ email: "", role: defaultRole })
    }
    setOpen(nextOpen)
  }

  const dialogProps: InviteMemberDialogProps = {
    open,
    onOpenChange: handleOpenChange,
    roles,
    formatRoleLabel: formatOrganizationRoleLabel,
    rolesPending,
    isPending,
    email,
    onEmailChange: (value) =>
      form.setValue("email", value, { shouldValidate: true }),
    emailError: form.formState.errors.email?.message,
    role,
    onRoleChange: (value) =>
      form.setValue("role", value, { shouldValidate: true }),
    roleError: form.formState.errors.role?.message,
    onSubmit: form.handleSubmit((values) => {
      inviteMember(values, {
        onSuccess: () => {
          toastManager.add({
            title: "Invitation sent",
            type: "success",
          })
          handleOpenChange(false)
        },
      })
    }),
  }

  return {
    open,
    openDialog: () => setOpen(true),
    dialogProps,
  }
}
