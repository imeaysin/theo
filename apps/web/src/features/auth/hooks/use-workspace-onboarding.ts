import { zodResolver } from "@hookform/resolvers/zod"
import {
  checkOrganizationSlugAvailable,
  resolveAvailableOrganizationSlug,
  useCreateOrganization,
  useAuthSession,
} from "@workspace/auth/react"
import { workspaceOnboardingSchema } from "@workspace/auth/forms"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { toastManager } from "@workspace/ui/components/toast"
import { routes } from "@/config/routes"

export function useWorkspaceOnboarding() {
  const navigate = useNavigate()
  const { data: session } = useAuthSession()
  const { mutateAsync: createOrganization, isPending } = useCreateOrganization()

  const form = useForm<z.infer<typeof workspaceOnboardingSchema>>({
    resolver: zodResolver(workspaceOnboardingSchema),
    defaultValues: { name: "" },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const userId = session?.user.id
    if (!userId) return

    const slug = await resolveAvailableOrganizationSlug(
      values.name,
      userId,
      checkOrganizationSlugAvailable
    )

    void toastManager
      .promise(createOrganization({ name: values.name, slug }), {
        error: {
          description: "Please try again or choose a different name.",
          title: "Could not create workspace",
          type: "error",
        },
        loading: {
          title: "Creating workspace…",
          description: "The workspace is being created.",
          type: "loading",
        },
        success: {
          description: "You're ready to use Theo.",
          title: "Workspace created",
          type: "success",
        },
      })
      .then(() => navigate(routes.dashboard, { replace: true }))
      .catch(() => undefined)
  })

  return {
    props: {
      control: form.control,
      isPending,
      onSubmit,
    },
  }
}
