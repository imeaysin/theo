import { zodResolver } from "@hookform/resolvers/zod"
import {
  checkOrganizationSlugAvailable,
  resolveAvailableOrganizationSlug,
  useAuthSession,
  useCreateOrganization,
} from "@workspace/auth/react"
import type { CreateOrganizationDialogProps } from "@workspace/ui/auth"
import type { OrganizationSlugAvailabilityState } from "@workspace/ui/auth"
import { useCallback, useEffect, useState } from "react"
import { useForm, useFormState, useWatch } from "react-hook-form"
import { toastManager } from "@workspace/ui/components/toast"
import {
  createOrganizationSchema,
  type CreateOrganizationInput,
} from "@workspace/auth/forms"

const defaultSlugAvailability: OrganizationSlugAvailabilityState = {
  checking: false,
  available: true,
}

export function useCreateOrganizationDialog() {
  const [open, setOpen] = useState(false)
  const [slugAvailability, setSlugAvailability] =
    useState<OrganizationSlugAvailabilityState>(defaultSlugAvailability)
  const { data: session } = useAuthSession()
  const { mutateAsync: createOrganization, isPending } = useCreateOrganization()
  const userId = session?.user.id

  const form = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: { name: "", slug: "" },
  })

  const name = useWatch({ control: form.control, name: "name" })
  const slug = useWatch({ control: form.control, name: "slug" })
  const { dirtyFields } = useFormState({ control: form.control })

  const resetForm = useCallback(() => {
    form.reset({ name: "", slug: "" })
    setSlugAvailability(defaultSlugAvailability)
  }, [form])

  useEffect(() => {
    if (!open || dirtyFields.slug || !userId) return

    const trimmedName = name.trim()
    if (!trimmedName) {
      form.setValue("slug", "", { shouldDirty: false, shouldValidate: false })
      return
    }

    let cancelled = false
    const timeout = window.setTimeout(() => {
      void resolveAvailableOrganizationSlug(
        trimmedName,
        userId,
        checkOrganizationSlugAvailable
      ).then((nextSlug) => {
        if (cancelled) return
        form.setValue("slug", nextSlug, {
          shouldDirty: false,
          shouldValidate: true,
        })
      })
    }, 200)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [dirtyFields.slug, form, name, open, userId])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetForm()
      }
      setOpen(nextOpen)
    },
    [resetForm]
  )

  const canSubmit =
    !isPending &&
    !slugAvailability.checking &&
    slugAvailability.available !== false &&
    Boolean(name.trim()) &&
    Boolean(slug.trim())

  const onSubmit = form.handleSubmit((values) => {
    if (!canSubmit) return

    void toastManager
      .promise(createOrganization(values), {
        error: {
          description: "That slug may already be taken. Try a different slug.",
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
      .catch(() => {
        return
      })
  })

  const dialogProps: CreateOrganizationDialogProps = {
    open,
    onOpenChange: handleOpenChange,
    control: form.control,
    isPending,
    canSubmit,
    onSlugBlur: () => void form.trigger("slug"),
    onSlugAvailabilityChange: setSlugAvailability,
    slugAvailabilityError: slugAvailability.error,
    onSubmit,
  }

  return {
    open,
    openDialog: () => setOpen(true),
    dialogProps,
  }
}
