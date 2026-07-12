import { useCreateOrganization } from "@workspace/auth/react"
import type { CreateOrganizationDialogProps } from "@workspace/ui-shadcn/auth"
import { useCallback, useState } from "react"
import { toastManager } from "@workspace/ui-shadcn/components/toast"

export function useCreateOrganizationDialog() {
  const [open, setOpen] = useState(false)
  const { mutateAsync: createOrganization } = useCreateOrganization()

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen)
  }, [])

  const dialogProps: CreateOrganizationDialogProps = {
    open,
    onOpenChange: handleOpenChange,
    onSubmit: async (values) => {
      await toastManager
        .promise(createOrganization(values), {
          error: {
            description:
              "That slug may already be taken. Try a different slug.",
            title: "Could not create workspace",
            type: "error",
          },
          loading: {
            title: "Creating workspace…",
            description: "The workspace is being created.",
            type: "loading",
          },
          success: {
            title: "Workspace created",
            description: "The workspace has been created.",
            type: "success",
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
