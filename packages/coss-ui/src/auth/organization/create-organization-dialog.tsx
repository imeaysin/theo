"use client"

import type { OrganizationSlugAvailabilityState } from "./organization-slug-field"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Pane } from "@workspace/ui/components/pane"
import { Controller, useFormState, type Control } from "react-hook-form"
import { OrganizationSlugField } from "./organization-slug-field"

type CreateOrganizationValues = { name: string; slug: string }

export type CreateOrganizationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  control: Control<CreateOrganizationValues>
  onSlugBlur?: () => void
  onSlugAvailabilityChange?: (state: OrganizationSlugAvailabilityState) => void
  slugAvailabilityError?: string
  onSubmit: () => void
  isPending?: boolean
  canSubmit?: boolean
  required?: boolean
  showSlug?: boolean
  title?: string
  description?: string
  submitLabel?: string
}

export function CreateOrganizationDialog({
  open,
  onOpenChange,
  control,
  onSlugBlur,
  onSlugAvailabilityChange,
  slugAvailabilityError,
  onSubmit,
  isPending = false,
  canSubmit = true,
  required = false,
  showSlug = true,
  title = "Create workspace",
  description = "Create a workspace to collaborate with your team.",
  submitLabel = "Create workspace",
}: CreateOrganizationDialogProps) {
  const { errors } = useFormState({ control })

  const formErrors: Record<string, string> = {}
  if (errors.name?.message) formErrors.name = errors.name.message

  const slugMessage = slugAvailabilityError ?? errors.slug?.message
  if (slugMessage) formErrors.slug = slugMessage

  function handleOpenChange(nextOpen: boolean) {
    if (required && !nextOpen) return
    onOpenChange(nextOpen)
  }

  return (
    <Pane onOpenChange={handleOpenChange} open={open}>
      <Pane.Content showCloseButton={!required}>
        <Pane.Header>
          <Pane.Title>{title}</Pane.Title>
          <Pane.Description>{description}</Pane.Description>
        </Pane.Header>

        <Form
          className="contents"
          errors={Object.keys(formErrors).length > 0 ? formErrors : undefined}
          onSubmit={onSubmit}
        >
          <Pane.Panel className="flex flex-col gap-4">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Field name="name">
                  <FieldLabel htmlFor="create-organization-name">
                    Name
                  </FieldLabel>
                  <Input
                    {...field}
                    autoFocus
                    disabled={isPending}
                    id="create-organization-name"
                    placeholder="Acme Inc."
                    type="text"
                  />
                  <FieldError />
                </Field>
              )}
            />

            {showSlug ? (
              <Controller
                control={control}
                name="slug"
                render={({ field }) => (
                  <OrganizationSlugField
                    disabled={isPending}
                    id="create-organization-slug"
                    onAvailabilityChange={onSlugAvailabilityChange}
                    onBlur={() => {
                      field.onBlur()
                      onSlugBlur?.()
                    }}
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
              />
            ) : null}
          </Pane.Panel>

          <Pane.Footer>
            {required ? null : (
              <Pane.Close
                render={
                  <Button
                    disabled={isPending}
                    type="button"
                    variant="outline"
                  />
                }
              >
                Cancel
              </Pane.Close>
            )}
            <Button disabled={!canSubmit} loading={isPending} type="submit">
              {submitLabel}
            </Button>
          </Pane.Footer>
        </Form>
      </Pane.Content>
    </Pane>
  )
}
