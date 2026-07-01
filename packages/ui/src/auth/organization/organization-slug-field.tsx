"use client"

import { useCheckSlug } from "@workspace/auth/react"
import { Check, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Field, FieldError } from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { Label } from "@workspace/ui/components/label"
import { Spinner } from "@workspace/ui/components/spinner"
import { sanitizeOrganizationSlug } from "./sanitize-slug"

export interface OrganizationSlugFieldProps {
  id?: string
  value: string
  onChange: (value: string) => void
  currentSlug?: string
  disabled?: boolean
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
  if (isAvailable) return <Check className="size-4 text-foreground" />
  if (hasError) return <X className="size-4 text-destructive" />
  return null
}

export function OrganizationSlugField({
  id = "organization-slug",
  value,
  onChange,
  currentSlug,
  disabled,
}: OrganizationSlugFieldProps) {
  const [fieldError, setFieldError] = useState<string>()
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

  return (
    <Field data-invalid={!!fieldError}>
      <Label htmlFor={id}>Slug</Label>
      <InputGroup>
        <InputGroupInput
          aria-invalid={!!fieldError}
          disabled={disabled}
          id={id}
          name="slug"
          onChange={(event) => {
            onChange(sanitizeOrganizationSlug(event.target.value))
            setFieldError(undefined)
          }}
          onInvalid={(event) => {
            event.preventDefault()
            setFieldError("Slug is required")
          }}
          placeholder="my-team"
          required
          value={value}
        />
        {value.trim() && value.trim() !== currentSlug ? (
          <InputGroupAddon align="inline-end">
            <SlugAvailabilityIcon
              hasError={!!checkSlugError}
              isAvailable={checkSlugData?.status}
              isChecking={isCheckingSlug}
            />
          </InputGroupAddon>
        ) : null}
      </InputGroup>
      <FieldError>{fieldError}</FieldError>
    </Field>
  )
}
