"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateOrganization } from "@workspace/auth/react"
import type { Organization } from "@workspace/auth/types/organization"
import type { OrganizationProfileProps } from "@workspace/ui/auth"
import { useCallback, useEffect, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"
import {
  updateOrganizationSchema,
  type UpdateOrganizationInput,
} from "@/features/auth/schemas"

export function useOrganizationProfileForm(
  organization: Organization
): OrganizationProfileProps {
  const slugEdited = useRef(false)
  const { mutate: updateOrganization, isPending } = useUpdateOrganization()

  const form = useForm<UpdateOrganizationInput>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: organization.name ?? "",
      slug: organization.slug ?? "",
    },
  })

  const name = useWatch({ control: form.control, name: "name" })
  const slug = useWatch({ control: form.control, name: "slug" })

  useEffect(() => {
    form.reset({
      name: organization.name ?? "",
      slug: organization.slug ?? "",
    })
    slugEdited.current = false
  }, [form, organization.id, organization.name, organization.slug])

  const handleSlugChange = useCallback(
    (value: string) => {
      slugEdited.current = true
      form.setValue("slug", value, { shouldValidate: true })
    },
    [form]
  )

  const onSubmit = useCallback(
    () =>
      form.handleSubmit((values) => {
        updateOrganization(values, {
          onSuccess: () => {
            toastManager.add({
              title: "Workspace updated",
              type: "success",
            })
          },
        })
      })(),
    [form, updateOrganization]
  )

  return {
    isPending,
    name,
    onNameChange: (value) =>
      form.setValue("name", value, { shouldValidate: true }),
    nameError: form.formState.errors.name?.message,
    slug,
    onSlugChange: handleSlugChange,
    onSlugBlur: () => void form.trigger("slug"),
    slugError: form.formState.errors.slug?.message,
    onSubmit,
  }
}
