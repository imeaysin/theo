import { zodResolver } from "@hookform/resolvers/zod"
import {
  useAssignableOrganizationRoles,
  useInviteMember,
} from "@workspace/auth/react"
import type { InviteMemberDialogProps } from "@workspace/ui/auth"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"
import {
  inviteMemberSchema,
  type InviteMemberInput,
} from "@workspace/auth/forms"

export function useInviteMemberDialog() {
  const [open, setOpen] = useState(false)
  const { roles, formatOrganizationRoleLabel } = useAssignableOrganizationRoles(
    undefined,
    { enabled: open }
  )
  const { mutateAsync: inviteMember, isPending } = useInviteMember()

  const defaultRole = roles.includes("member") ? "member" : (roles.at(-1) ?? "")

  const form = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: "", role: "" },
  })

  useEffect(() => {
    if (!open || roles.length === 0) return

    const currentRole = form.getValues("role")
    const nextRole = roles.includes(currentRole) ? currentRole : defaultRole
    form.setValue("role", nextRole, { shouldValidate: true })
  }, [defaultRole, form, open, roles])

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset({ email: "", role: "" })
    }
    setOpen(nextOpen)
  }

  const dialogProps: InviteMemberDialogProps = {
    open,
    onOpenChange: handleOpenChange,
    control: form.control,
    roles,
    formatRoleLabel: formatOrganizationRoleLabel,
    isPending,
    onSubmit: form.handleSubmit((values) => {
      void toastManager
        .promise(inviteMember(values), {
          error: {
            description: "Check the email address and try again.",
            title: "Could not send invitation",
            type: "error",
          },
          loading: {
            title: "Sending invitation…",
            description: "The invitation is being sent.",
            type: "loading",
          },
          success: {
            title: "Invitation sent",
            description: "The invitation has been sent.",
            type: "success",
          },
        })
        .then(() => handleOpenChange(false))
        .catch(() => {
          form.setError("email", {
            message: "Could not send the invitation. Please try again.",
          })
        })
    }),
  }

  return {
    open,
    openDialog: () => setOpen(true),
    dialogProps,
  }
}
