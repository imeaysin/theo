"use client"

import {
  isOrganizationSlugTakenError,
  useCheckSlug,
} from "@workspace/auth/react"
import { mergeProps } from "@base-ui/react/merge-props"
import { Check, X } from "lucide-react"
import { type ChangeEvent, useEffect } from "react"
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { Spinner } from "@workspace/ui/components/spinner"
import { sanitizeOrganizationSlug } from "./sanitize-slug"

export function isSameOrganizationSlug(
  value: string,
  currentSlug?: string | null
) {
  if (!currentSlug) return false

  return (
    sanitizeOrganizationSlug(value.trim()) ===
    sanitizeOrganizationSlug(currentSlug.trim())
  )
}

export type OrganizationSlugAvailabilityState = {
  checking: boolean
  available: boolean | null
  error?: string
}

export type OrganizationSlugFieldProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  currentSlug?: string
  checkAvailability?: boolean
  disabled?: boolean
  onAvailabilityChange?: (state: OrganizationSlugAvailabilityState) => void
}

function SlugAvailabilityIcon({
  isChecking,
  isAvailable,
  hasError,
}: {
  isChecking: boolean
  isAvailable?: boolean
  hasError: boolean
}) {
  if (isChecking) return <Spinner />
  if (isAvailable) return <Check className="size-4" />
  if (hasError) return <X className="size-4 text-destructive" />
  return null
}

export function OrganizationSlugField({
  id = "organization-slug",
  value,
  onChange,
  onBlur,
  currentSlug,
  checkAvailability = true,
  disabled,
  onAvailabilityChange,
}: OrganizationSlugFieldProps) {
  const {
    mutate: checkSlug,
    data: checkSlugData,
    error: checkSlugError,
    isPending: isCheckingSlug,
    reset: resetCheckSlug,
  } = useCheckSlug()

  const trimmedValue = value.trim()
  const isCurrentSlug = isSameOrganizationSlug(value, currentSlug)
  const shouldCheckAvailability =
    checkAvailability && trimmedValue.length > 0 && !isCurrentSlug

  useEffect(() => {
    resetCheckSlug()

    if (!shouldCheckAvailability) return

    const timeout = window.setTimeout(() => {
      checkSlug({ slug: trimmedValue })
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [checkSlug, resetCheckSlug, shouldCheckAvailability, trimmedValue])

  const slugTaken =
    shouldCheckAvailability &&
    !isCheckingSlug &&
    checkSlugData?.available === false

  const availabilityError =
    shouldCheckAvailability &&
    !isCheckingSlug &&
    checkSlugError &&
    !isOrganizationSlugTakenError(checkSlugError)
      ? "Could not verify slug availability"
      : undefined

  useEffect(() => {
    if (!onAvailabilityChange) return

    if (!shouldCheckAvailability) {
      onAvailabilityChange({ checking: false, available: true })
      return
    }

    if (isCheckingSlug) {
      onAvailabilityChange({ checking: true, available: null })
      return
    }

    if (checkSlugError && !isOrganizationSlugTakenError(checkSlugError)) {
      onAvailabilityChange({
        checking: false,
        available: null,
        error: availabilityError,
      })
      return
    }

    onAvailabilityChange({
      checking: false,
      available: checkSlugData?.available ?? null,
      error: slugTaken ? "This slug is already taken" : undefined,
    })
  }, [
    availabilityError,
    checkSlugData?.available,
    checkSlugError,
    isCheckingSlug,
    onAvailabilityChange,
    shouldCheckAvailability,
    slugTaken,
  ])

  return (
    <Field name="slug">
      <FieldLabel htmlFor={id}>Slug</FieldLabel>
      <InputGroup>
        <FieldControl
          render={(controlProps) => (
            <InputGroupInput
              {...mergeProps(controlProps, {
                autoComplete: "off",
                disabled,
                id,
                onBlur,
                onChange: (event: ChangeEvent<HTMLInputElement>) =>
                  onChange(sanitizeOrganizationSlug(event.target.value)),
                placeholder: "my-team",
                type: "text",
                value,
              })}
            />
          )}
        />
        {shouldCheckAvailability ? (
          <InputGroupAddon align="inline-end">
            <SlugAvailabilityIcon
              hasError={slugTaken}
              isAvailable={checkSlugData?.available}
              isChecking={isCheckingSlug}
            />
          </InputGroupAddon>
        ) : null}
      </InputGroup>
      <FieldError />
    </Field>
  )
}
