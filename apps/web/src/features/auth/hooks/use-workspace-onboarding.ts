"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateOrganization, useAuthSession } from "@workspace/auth/react"
import { sanitizeOrganizationSlug } from "@workspace/ui/auth"
import { useNavigate } from "react-router-dom"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { toastManager } from "@workspace/ui/components/toast"
import { routes } from "@/config/routes"

const workspaceOnboardingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
})

export function useWorkspaceOnboarding() {
  const navigate = useNavigate()
  const { data: session } = useAuthSession()
  const { mutate: createOrganization, isPending } = useCreateOrganization()

  const form = useForm<z.infer<typeof workspaceOnboardingSchema>>({
    resolver: zodResolver(workspaceOnboardingSchema),
    defaultValues: { name: "" },
  })

  const name = useWatch({ control: form.control, name: "name" })

  function onSubmit() {
    void form.handleSubmit((values) => {
      const userId = session?.user.id
      if (!userId) return

      createOrganization(
        {
          name: values.name,
          slug: `${sanitizeOrganizationSlug(values.name) || "workspace"}-${userId.slice(0, 8)}`,
        },
        {
          onSuccess: () => {
            toastManager.add({
              title: "Workspace created",
              description: "You're ready to use Theo.",
              type: "success",
            })
            navigate(routes.dashboard, { replace: true })
          },
          onError: () => {
            toastManager.add({
              title: "Could not create workspace",
              type: "error",
            })
          },
        }
      )
    })()
  }

  return {
    dialogProps: {
      open: true,
      required: true,
      showSlug: false,
      onOpenChange: () => undefined,
      isPending,
      name,
      onNameChange: (value: string) =>
        form.setValue("name", value, { shouldValidate: true }),
      nameError: form.formState.errors.name?.message,
      slug: "",
      onSlugChange: () => undefined,
      onSubmit,
      title: "Name your workspace",
      description:
        "Choose a name for your workspace. You can invite teammates later.",
      submitLabel: "Continue",
    },
  }
}
