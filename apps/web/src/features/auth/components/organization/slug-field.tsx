"use client"

import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useCheckSlug,
} from "@better-auth-ui/react"
import { useDebouncer } from "@tanstack/react-pacer"
import { Check, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Field, FieldError } from "@workspace/ui-shadcn/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui-shadcn/components/input-group"
import { Label } from "@workspace/ui-shadcn/components/label"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { organizationPlugin } from "@/lib/auth/organization-plugin"

/** Props for the `SlugField` component. */
export type SlugFieldProps = {
  value: string
  onChange: (value: string) => void
  currentSlug?: string
  disabled?: boolean
  id?: string
}

/**
 * Sanitize a slug value so it only contains lowercase alphanumeric characters
 * and dashes. Runs of disallowed characters are collapsed to a single dash, but
 * leading/trailing dashes are preserved while the user is still typing.
 */
export function sanitizeSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
}

function SlugCheckIndicator({
  checkSlugData,
  checkSlugError,
}: {
  checkSlugData: { status?: boolean } | undefined
  checkSlugError: unknown
}) {
  if (checkSlugData?.status) {
    return <Check className="size-4 text-foreground" />
  }

  if (checkSlugError) {
    return <X className="size-4 text-destructive" />
  }

  return <Spinner />
}

/**
 * Organization slug field with debounced availability checking.
 */
export function SlugField({
  value,
  onChange,
  currentSlug,
  disabled,
  id = "slug",
}: SlugFieldProps) {
  const { authClient, localization: authLocalization } = useAuth()
  const {
    localization,
    checkSlug: checkSlugEnabled,
    slugPrefix,
  } = useAuthPlugin(organizationPlugin)

  const [fieldValidation, setFieldValidation] = useState<{
    atValue: string
    message: string
  }>()
  const slugError =
    fieldValidation?.atValue === value ? fieldValidation.message : undefined

  const {
    mutate: checkSlug,
    data: checkSlugData,
    error: checkSlugError,
    reset: resetCheckSlug,
  } = useCheckSlug(authClient as OrganizationAuthClient)

  const debouncer = useDebouncer(
    (next: string) => {
      if (!checkSlugEnabled || !next.trim() || next.trim() === currentSlug)
        return

      checkSlug({ slug: next.trim() })
    },
    { wait: 500 }
  )

  useEffect(() => {
    if (!checkSlugEnabled) return

    resetCheckSlug()
    debouncer.maybeExecute(value)
  }, [checkSlugEnabled, value, debouncer, resetCheckSlug])

  return (
    <Field data-invalid={!!slugError}>
      <Label htmlFor={id}>{localization.slug}</Label>

      <InputGroup>
        {slugPrefix && (
          <InputGroupAddon align="inline-start">{slugPrefix}</InputGroupAddon>
        )}

        <InputGroupInput
          id={id}
          name="slug"
          value={value}
          onChange={(e) => {
            onChange(sanitizeSlug(e.target.value))
            setFieldValidation(undefined)
          }}
          onInvalid={(e) => {
            e.preventDefault()
            setFieldValidation({
              atValue: value,
              message: authLocalization.auth.fieldRequired,
            })
          }}
          aria-invalid={!!slugError}
          placeholder={localization.slugPlaceholder}
          required
          disabled={disabled}
        />

        {checkSlugEnabled && !!value.trim() && value.trim() !== currentSlug && (
          <InputGroupAddon align="inline-end">
            <SlugCheckIndicator
              checkSlugData={checkSlugData}
              checkSlugError={checkSlugError}
            />
          </InputGroupAddon>
        )}
      </InputGroup>

      <FieldError>{slugError}</FieldError>
    </Field>
  )
}
