"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  useAuthUiConfig,
  useChangeEmail,
  useSession,
} from "@workspace/auth/react"
import type { ChangeEmailProps } from "@workspace/ui/auth"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"
import {
  changeEmailSchema,
  type ChangeEmailInput,
} from "@/features/auth/schemas"

export function useChangeEmailForm(): ChangeEmailProps {
  const config = useAuthUiConfig()
  const { data: session } = useSession()
  const { mutate: changeEmail, isPending } = useChangeEmail()

  const form = useForm<ChangeEmailInput>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: session?.user.email ?? "" },
  })

  const email = useWatch({ control: form.control, name: "email" })

  useEffect(() => {
    if (session?.user.email) {
      form.reset({ email: session.user.email })
    }
  }, [form, session?.user.email])

  return {
    hasSession: !!session,
    isPending,
    email,
    onEmailChange: (value) =>
      form.setValue("email", value, { shouldValidate: true }),
    emailError: form.formState.errors.email?.message,
    onSubmit: form.handleSubmit((values) => {
      changeEmail(
        {
          newEmail: values.email,
          callbackURL: config.absoluteAppUrl(config.routes.settingsAccount),
        },
        {
          onSuccess: () => {
            toastManager.add({
              title: "Verification email sent to your new address",
              type: "success",
            })
          },
        }
      )
    }),
  }
}
