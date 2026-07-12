import {
  useCreateAdminUser,
  usePlatformRoleOptions,
} from "@workspace/auth/react"
import type { CreateUserDialogProps } from "@workspace/ui-shadcn/auth"
import { createAdminUserSchema } from "@workspace/auth/forms"
import { useState } from "react"
import { toastManager } from "@workspace/ui-shadcn/components/toast"

export function useCreateUserDialog() {
  const [open, setOpen] = useState(false)
  const { roles, formatPlatformRoleLabel } = usePlatformRoleOptions()
  const { mutateAsync: createUser } = useCreateAdminUser()

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
  }

  const dialogProps: CreateUserDialogProps = {
    open,
    onOpenChange: handleOpenChange,
    roles,
    formatRoleLabel: formatPlatformRoleLabel,
    onSubmit: async (values) => {
      const parsedValues = createAdminUserSchema.parse(values)
      await toastManager
        .promise(createUser(parsedValues), {
          loading: {
            title: "Creating user…",
            description: "The account is being created.",
            type: "loading",
          },
          success: {
            title: "User created",
            description: "The platform user has been created.",
            type: "success",
          },
          error: {
            title: "Could not create user",
            description: "Check the details and try again.",
            type: "error",
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
