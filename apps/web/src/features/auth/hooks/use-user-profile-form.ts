import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthSession, useUpdateUser } from "@workspace/auth/react"
import type { UserProfileProps } from "@workspace/ui/auth"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"
import { userNameSchema, type UserNameInput } from "@workspace/auth/forms"

export function useUserProfileForm(): UserProfileProps {
  const { data: session } = useAuthSession()
  const { mutateAsync: updateUser, isPending } = useUpdateUser()

  const form = useForm<UserNameInput>({
    resolver: zodResolver(userNameSchema),
    defaultValues: { name: session?.user.name ?? "" },
  })

  useEffect(() => {
    if (session?.user.name) {
      form.reset({ name: session.user.name })
    }
  }, [form, session?.user.name])

  return {
    control: form.control,
    hasSession: !!session,
    isPending,
    onSubmit: form.handleSubmit((values) => {
      void toastManager
        .promise(updateUser(values), {
          error: {
            description: "Please try again.",
            title: "Could not update profile",
            type: "error",
          },
          loading: {
            title: "Saving profile…",
            description: "The profile is being saved.",
            type: "loading",
          },
          success: {
            title: "Profile updated",
            description: "The profile has been updated.",
            type: "success",
          },
        })
        .catch(() => undefined)
    }),
  }
}
