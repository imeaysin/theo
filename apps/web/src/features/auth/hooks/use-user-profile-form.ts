import { useUpdateUser } from "@workspace/auth/react"
import type { UserProfileProps } from "@workspace/ui-shadcn/auth"
import { toastManager } from "@workspace/ui-shadcn/components/toast"

export function useUserProfileForm(): UserProfileProps {
  const { mutateAsync: updateUser, isPending } = useUpdateUser()

  return {
    isPending,
    onSubmit: (values) => {
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
    },
  }
}
