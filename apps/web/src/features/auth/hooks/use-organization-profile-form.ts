import { useUpdateOrganization } from "@workspace/auth/react"
import type { Organization } from "@workspace/auth/types/organization"
import type { OrganizationProfileProps } from "@workspace/ui-shadcn/auth"
import { toastManager } from "@workspace/ui-shadcn/components/toast"

export function useOrganizationProfileForm(
  _organization: Organization
): OrganizationProfileProps {
  const { mutateAsync: updateOrganization } = useUpdateOrganization()

  return {
    onSubmit: async (values) => {
      await toastManager
        .promise(updateOrganization(values), {
          error: {
            description:
              "That slug may already be taken. Try a different slug.",
            title: "Could not update workspace",
            type: "error",
          },
          loading: {
            title: "Saving workspace…",
            description: "The workspace is being saved.",
            type: "loading",
          },
          success: {
            title: "Workspace updated",
            description: "The workspace has been updated.",
            type: "success",
          },
        })
        .catch(() => undefined)
    },
  }
}
