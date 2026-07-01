"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateOrganization } from "@workspace/auth/react"
import type { Organization } from "@workspace/auth/types/organization"
import type { OrganizationProfileProps } from "@workspace/ui/auth"
import type { OrganizationSlugAvailabilityState } from "@workspace/ui/auth"
import { isSameOrganizationSlug } from "@workspace/ui/auth"
import { useCallback, useEffect, useRef, useState } from "react"
import { useForm, useFormState, useWatch } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"
import {
  updateOrganizationSchema,
  type UpdateOrganizationInput,
} from "@/features/auth/schemas"

const defaultSlugAvailability: OrganizationSlugAvailabilityState = {
  checking: false,
  available: true,
}

export function useOrganizationProfileForm(
  organization: Organization
): OrganizationProfileProps {
  const slugEdited = useRef(false)
  const [slugAvailability, setSlugAvailability] =
    useState<OrganizationSlugAvailabilityState>(defaultSlugAvailability)
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
  const { errors } = useFormState({ control: form.control })
  const savedSlug = organization.slug ?? ""
  const slugUnchanged = isSameOrganizationSlug(slug, savedSlug)

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

  const canSubmit =
    !isPending &&
    !slugAvailability.checking &&
    (slugUnchanged || slugAvailability.available !== false)

  const onSubmit = form.handleSubmit((values) => {
    if (!canSubmit) return

    updateOrganization(values, {
      onSuccess: () => {
        toastManager.add({
          title: "Workspace updated",
          type: "success",
        })
        form.reset(values)
      },
      onError: () => {
        toastManager.add({
          title: "Could not update workspace",
          description: "That slug may already be taken. Try a different slug.",
          type: "error",
        })
      },
    })
  })

  return {
    isPending,
    canSubmit,
    name,
    onNameChange: (value) =>
      form.setValue("name", value, { shouldValidate: true }),
    nameError: errors.name?.message,
    slug,
    currentSlug: savedSlug,
    onSlugChange: handleSlugChange,
    onSlugBlur: () => {
      if (slugUnchanged) return
      void form.trigger("slug")
    },
    onSlugAvailabilityChange: setSlugAvailability,
    slugError: errors.slug?.message,
    checkSlugAvailability: !slugUnchanged,
    onSubmit,
  }
}
