"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  buildOrganizationSlug,
  useCreateOrganization,
  useAuthSession,
} from "@workspace/auth/react"
import { useNavigate } from "react-router-dom"
import { useForm, useFormState, useWatch } from "react-hook-form"
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
  const { errors } = useFormState({ control: form.control })

  const onSubmit = form.handleSubmit((values) => {
    const userId = session?.user.id
    if (!userId) return

    createOrganization(
      {
        name: values.name,
        slug: buildOrganizationSlug(values.name, userId),
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
  })

  return {
    props: {
      isPending,
      name,
      onNameChange: (value: string) =>
        form.setValue("name", value, { shouldValidate: true }),
      nameError: errors.name?.message,
      onSubmit,
    },
  }
}
