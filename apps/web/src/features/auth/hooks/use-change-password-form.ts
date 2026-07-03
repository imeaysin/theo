import { zodResolver } from "@hookform/resolvers/zod"
import { useChangePassword, useAuthSession } from "@workspace/auth/react"
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@workspace/contracts"
import type { ChangePasswordFormProps } from "@workspace/ui/auth"
import { useForm } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"

export function useChangePasswordForm(): ChangePasswordFormProps {
  const { data: session } = useAuthSession()
  const { mutate: changePassword, isPending } = useChangePassword()

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  return {
    control: form.control,
    hasSession: !!session,
    isPending,
    onSubmit: form.handleSubmit((values) => {
      changePassword(
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          revokeOtherSessions: true,
        },
        {
          onError: () => {
            form.setError("currentPassword", {
              message: "Check your current password and try again.",
            })
            form.setValue("currentPassword", "")
          },
          onSuccess: () => {
            form.reset()
            toastManager.add({
              title: "Password updated",
              description: "Your password has been updated.",
              type: "success",
            })
          },
        }
      )
    }),
  }
}
