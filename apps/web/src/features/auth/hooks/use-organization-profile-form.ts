import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateOrganization } from "@workspace/auth/react"
import type { Organization } from "@workspace/auth/types/organization"
import type { OrganizationProfileProps } from "@workspace/ui/auth"
import type { OrganizationSlugAvailabilityState } from "@workspace/ui/auth"
import { isSameOrganizationSlug } from "@workspace/ui/auth"
import { useEffect, useRef, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"
import {
  updateOrganizationSchema,
  type UpdateOrganizationInput,
} from "@workspace/auth/forms"

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
  const { mutateAsync: updateOrganization, isPending } = useUpdateOrganization()

  const form = useForm<UpdateOrganizationInput>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: organization.name ?? "",
      slug: organization.slug ?? "",
    },
  })

  const slug = useWatch({ control: form.control, name: "slug" })
  const savedSlug = organization.slug ?? ""
  const slugUnchanged = isSameOrganizationSlug(slug, savedSlug)

  useEffect(() => {
    form.reset({
      name: organization.name ?? "",
      slug: organization.slug ?? "",
    })
    slugEdited.current = false
  }, [form, organization.id, organization.name, organization.slug])

  const canSubmit =
    !isPending &&
    !slugAvailability.checking &&
    (slugUnchanged || slugAvailability.available !== false)

  const onSubmit = form.handleSubmit((values) => {
    if (!canSubmit) return

    void toastManager
      .promise(updateOrganization(values), {
        error: {
          description: "That slug may already be taken. Try a different slug.",
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
      .then(() => form.reset(values))
      .catch(() => undefined)
  })

  return {
    control: form.control,
    isPending,
    canSubmit,
    currentSlug: savedSlug,
    onSlugBlur: () => {
      if (slugUnchanged) return
      void form.trigger("slug")
    },
    onSlugAvailabilityChange: setSlugAvailability,
    slugAvailabilityError: slugAvailability.error,
    checkSlugAvailability: !slugUnchanged,
    onSubmit,
  }
}
