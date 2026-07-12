import { useAuthUiConfig, useChangeEmail } from "@workspace/auth/react"
import type { ChangeEmailProps } from "@workspace/ui-shadcn/auth"
import { toastManager } from "@workspace/ui-shadcn/components/toast"

export function useChangeEmailForm(): ChangeEmailProps {
  const config = useAuthUiConfig()
  const { mutate: changeEmail, isPending } = useChangeEmail()

  return {
    isPending,
    onSubmit: (values) => {
      void toastManager
        .promise(
          new Promise<void>((resolve, reject) =>
            changeEmail(
              {
                newEmail: values.email,
                callbackURL: config.absoluteAppUrl(
                  config.routes.settingsAccount
                ),
              },
              { onSuccess: () => resolve(), onError: reject }
            )
          ),
          {
            error: {
              description: "Check the address and try again.",
              title: "Could not send verification email",
              type: "error",
            },
            loading: {
              title: "Sending verification email…",
              description: "The verification email is being sent.",
              type: "loading",
            },
            success: {
              description: "Check your inbox to confirm the change.",
              title: "Verification email sent",
              type: "success",
            },
          }
        )
        .catch(() => undefined)
    },
  }
}
