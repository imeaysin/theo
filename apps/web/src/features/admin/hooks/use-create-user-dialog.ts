import { zodResolver } from "@hookform/resolvers/zod"
import {
  useCreateAdminUser,
  usePlatformRoleOptions,
} from "@workspace/auth/react"
import type { CreateUserDialogProps } from "@workspace/ui/auth"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"
import {
  createAdminUserSchema,
  type CreateAdminUserInput,
} from "@workspace/auth/forms"

export function useCreateUserDialog() {
  const [open, setOpen] = useState(false)
  const { roles, formatPlatformRoleLabel } = usePlatformRoleOptions()
  const { mutateAsync: createUser, isPending } = useCreateAdminUser()

  const defaultRole = roles.includes("user") ? "user" : (roles.at(-1) ?? "user")

  const form = useForm<CreateAdminUserInput>({
    resolver: zodResolver(createAdminUserSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      role: defaultRole,
    },
  })

  useEffect(() => {
    if (!open) return
    form.setValue("role", defaultRole, { shouldValidate: true })
  }, [defaultRole, form, open])

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset({
        email: "",
        name: "",
        password: "",
        role: defaultRole,
      })
    }
    setOpen(nextOpen)
  }

  const dialogProps: CreateUserDialogProps = {
    open,
    onOpenChange: handleOpenChange,
    control: form.control,
    roles,
    formatRoleLabel: formatPlatformRoleLabel,
    isPending,
    onSubmit: form.handleSubmit((values) => {
      void toastManager
        .promise(createUser(values), {
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
    }),
  }

  return {
    open,
    openDialog: () => setOpen(true),
    dialogProps,
  }
}
