"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthSession, useUpdateUser } from "@workspace/auth/react"
import type { UserProfileProps } from "@workspace/ui/auth"
import { useEffect } from "react"
import { useForm, useFormState, useWatch } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"
import { userNameSchema, type UserNameInput } from "@/features/auth/schemas"

export function useUserProfileForm(): UserProfileProps {
  const { data: session } = useAuthSession()
  const { mutate: updateUser, isPending } = useUpdateUser()

  const form = useForm<UserNameInput>({
    resolver: zodResolver(userNameSchema),
    defaultValues: { name: session?.user.name ?? "" },
  })

  const name = useWatch({ control: form.control, name: "name" })
  const { errors } = useFormState({ control: form.control })

  useEffect(() => {
    if (session?.user.name) {
      form.reset({ name: session.user.name })
    }
  }, [form, session?.user.name])

  return {
    hasSession: !!session,
    isPending,
    name,
    onNameChange: (value) =>
      form.setValue("name", value, { shouldValidate: true }),
    nameError: errors.name?.message,
    onSubmit: form.handleSubmit((values) => {
      updateUser(values, {
        onSuccess: () => {
          toastManager.add({
            title: "Profile updated",
            type: "success",
          })
        },
      })
    }),
  }
}
