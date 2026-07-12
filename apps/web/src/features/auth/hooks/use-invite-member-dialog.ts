import {
  useAssignableOrganizationRoles,
  useInviteMember,
} from "@workspace/auth/react"
import type { InviteMemberDialogProps } from "@workspace/ui-shadcn/auth"
import { useState } from "react"
import { toastManager } from "@workspace/ui-shadcn/components/toast"

export function useInviteMemberDialog() {
  const [open, setOpen] = useState(false)
  const { roles, formatOrganizationRoleLabel } = useAssignableOrganizationRoles(
    undefined,
    { enabled: open }
  )
  const { mutateAsync: inviteMember } = useInviteMember()

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
  }

  const dialogProps: InviteMemberDialogProps = {
    open,
    onOpenChange: handleOpenChange,
    roles,
    formatRoleLabel: formatOrganizationRoleLabel,
    onSubmit: async (values) => {
      await toastManager
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
        .catch(() => undefined)
    },
  }

  return {
    open,
    openDialog: () => setOpen(true),
    dialogProps,
  }
}
