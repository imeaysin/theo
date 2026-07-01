"use client"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { OrganizationSlugField } from "./organization-slug-field"

export interface CreateOrganizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  onNameChange: (value: string) => void
  nameError?: string
  slug: string
  onSlugChange: (value: string) => void
  onSlugBlur?: () => void
  slugError?: string
  onSubmit: () => void
  isPending?: boolean
  required?: boolean
  showSlug?: boolean
  title?: string
  description?: string
  submitLabel?: string
}

export function CreateOrganizationDialog({
  open,
  onOpenChange,
  name,
  onNameChange,
  nameError,
  slug,
  onSlugChange,
  onSlugBlur,
  slugError,
  onSubmit,
  isPending = false,
  required = false,
  showSlug = true,
  title = "Create workspace",
  description = "Create a workspace to collaborate with your team.",
  submitLabel = "Create workspace",
}: CreateOrganizationDialogProps) {
  function handleOpenChange(nextOpen: boolean) {
    if (required && !nextOpen) return
    onOpenChange(nextOpen)
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogPopup showCloseButton={!required}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form className="contents" onSubmit={onSubmit}>
          <DialogPanel className="flex flex-col gap-4">
            <Field data-invalid={!!nameError}>
              <FieldLabel htmlFor="create-organization-name">Name</FieldLabel>
              <Input
                aria-invalid={!!nameError}
                autoFocus
                disabled={isPending}
                id="create-organization-name"
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="Acme Inc."
                type="text"
                value={name}
              />
              <FieldError>{nameError}</FieldError>
            </Field>

            {showSlug ? (
              <OrganizationSlugField
                disabled={isPending}
                error={slugError}
                id="create-organization-slug"
                onBlur={onSlugBlur}
                onChange={onSlugChange}
                value={slug}
              />
            ) : null}
          </DialogPanel>

          <DialogFooter>
            {required ? null : (
              <DialogClose
                render={
                  <Button
                    disabled={isPending}
                    type="button"
                    variant="outline"
                  />
                }
              >
                Cancel
              </DialogClose>
            )}
            <Button loading={isPending} type="submit">
              {submitLabel}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  )
}
