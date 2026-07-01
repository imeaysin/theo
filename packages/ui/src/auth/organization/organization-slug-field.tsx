"use client"

import { useCheckSlug } from "@workspace/auth/react"
import { Check, X } from "lucide-react"
import { useEffect } from "react"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { Spinner } from "@workspace/ui/components/spinner"
import { sanitizeOrganizationSlug } from "./sanitize-slug"

export interface OrganizationSlugFieldProps {
  id?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  currentSlug?: string
  disabled?: boolean
  error?: string
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
  if (hasError) return <X className="size-4 text-destructive-foreground" />
  return null
}

export function OrganizationSlugField({
  id = "organization-slug",
  value,
  onChange,
  onBlur,
  currentSlug,
  disabled,
  error,
}: OrganizationSlugFieldProps) {
  const {
    mutate: checkSlug,
    data: checkSlugData,
    error: checkSlugError,
    isPending: isCheckingSlug,
    reset: resetCheckSlug,
  } = useCheckSlug()

  useEffect(() => {
    resetCheckSlug()

    const trimmed = value.trim()
    if (!trimmed || trimmed === currentSlug) return

    const timeout = window.setTimeout(() => {
      checkSlug({ slug: trimmed })
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [checkSlug, currentSlug, resetCheckSlug, value])

  const slugTaken = !!checkSlugError || checkSlugData?.status === false
  const validationError =
    error ?? (slugTaken ? "This slug is already taken" : undefined)

  return (
    <Field data-invalid={!!validationError}>
      <FieldLabel htmlFor={id}>Slug</FieldLabel>
      <InputGroup>
        <InputGroupInput
          aria-invalid={!!validationError}
          disabled={disabled}
          id={id}
          name="slug"
          onBlur={onBlur}
          onChange={(event) =>
            onChange(sanitizeOrganizationSlug(event.target.value))
          }
          placeholder="my-team"
          type="text"
          value={value}
        />
        {value.trim() && value.trim() !== currentSlug ? (
          <InputGroupAddon align="inline-end">
            <SlugAvailabilityIcon
              hasError={slugTaken}
              isAvailable={checkSlugData?.status}
              isChecking={isCheckingSlug}
            />
          </InputGroupAddon>
        ) : null}
      </InputGroup>
      <FieldError>{validationError}</FieldError>
    </Field>
  )
}
