import { useMutation } from "@tanstack/react-query"
import { useActiveOrganizationId } from "@workspace/auth/react"
import { UploadResponseSchema, type UploadResponse } from "@workspace/contracts"
import { toastManager } from "@workspace/ui-shadcn/components/toast"
import { apiRoutes } from "@/config/api-routes"
import { apiFetch } from "@/lib/api"

export function useUploadFileMutation() {
  const organizationId = useActiveOrganizationId()

  return useMutation({
    mutationFn: async (file: File) => {
      if (!organizationId) {
        throw new Error("No active workspace")
      }

      const formData = new FormData()
      formData.append("file", file)

      const data = await toastManager.promise(
        apiFetch<unknown>(apiRoutes.uploads, {
          method: "POST",
          body: formData,
        }),
        {
          loading: { title: "Uploading…" },
          success: { title: "File uploaded" },
          error: {
            title: "Upload failed",
            description: "Please try again.",
            type: "error",
          },
        }
      )

      return UploadResponseSchema.parse(data)
    },
  })
}

export type { UploadResponse }
