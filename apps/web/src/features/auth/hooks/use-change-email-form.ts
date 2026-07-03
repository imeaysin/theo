import { zodResolver } from "@hookform/resolvers/zod"
import {
  useAuthUiConfig,
  useChangeEmail,
  useAuthSession,
} from "@workspace/auth/react"
import type { ChangeEmailProps } from "@workspace/ui/auth"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"
import { changeEmailSchema, type ChangeEmailInput } from "@workspace/auth/forms"

export function useChangeEmailForm(): ChangeEmailProps {
  const config = useAuthUiConfig()
  const { data: session } = useAuthSession()
  const { mutateAsync: changeEmail, isPending } = useChangeEmail()

  const form = useForm<ChangeEmailInput>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: session?.user.email ?? "" },
  })

  useEffect(() => {
    if (session?.user.email) {
      form.reset({ email: session.user.email })
    }
  }, [form, session?.user.email])

  return {
    control: form.control,
    hasSession: !!session,
    isPending,
    onSubmit: form.handleSubmit((values) => {
      void toastManager
        .promise(
          changeEmail({
            newEmail: values.email,
            callbackURL: config.absoluteAppUrl(config.routes.settingsAccount),
          }),
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
    }),
  }
}
