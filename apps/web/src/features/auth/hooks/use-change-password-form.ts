import { useChangePassword } from "@workspace/auth/react"
import type { ChangePasswordFormProps } from "@workspace/ui-shadcn/auth"
import { toastManager } from "@workspace/ui-shadcn/components/toast"

export function useChangePasswordForm(): ChangePasswordFormProps {
  const { mutate: changePassword, isPending } = useChangePassword()

  return {
    isPending,
    onSubmit: (values) => {
      changePassword(
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          revokeOtherSessions: true,
        },
        {
          onError: () => {
            toastManager.add({
              title: "Update failed",
              description: "Check your current password and try again.",
              type: "error",
            })
          },
          onSuccess: () => {
            toastManager.add({
              title: "Password updated",
              description: "Your password has been updated.",
              type: "success",
            })
          },
        }
      )
    },
  }
}
