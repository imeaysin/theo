"use client"

import { useCreateOrganization } from "@workspace/auth/react"
import { Briefcase } from "lucide-react"
import { type SyntheticEvent, useState } from "react"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Spinner } from "@workspace/ui/components/spinner"
import { toastManager } from "@workspace/ui/components/toast"
import { OrganizationSlugField } from "./organization-slug-field"
import { sanitizeOrganizationSlug } from "./sanitize-slug"

export interface CreateOrganizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const initialFormState = {
  name: "",
  slug: "",
  slugEdited: false,
  nameError: undefined as string | undefined,
}

export function CreateOrganizationDialog({
  open,
  onOpenChange,
}: CreateOrganizationDialogProps) {
  const [form, setForm] = useState(initialFormState)
  const { mutate: createOrganization, isPending } = useCreateOrganization()

  function resetForm() {
    setForm(initialFormState)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
  }

  function handleNameChange(value: string) {
    setForm((current) => ({
      ...current,
      name: value,
      nameError: undefined,
      slug: current.slugEdited ? current.slug : sanitizeOrganizationSlug(value),
    }))
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    createOrganization(
      { name: form.name, slug: form.slug },
      {
        onSuccess: () => {
          toastManager.add({
            title: "Workspace created",
            type: "success",
          })
          handleOpenChange(false)
        },
      }
    )
  }

  return (
    <AlertDialog onOpenChange={handleOpenChange} open={open}>
      <AlertDialogPopup>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted sm:mx-0">
              <Briefcase aria-hidden="true" className="size-5" />
            </div>
            <AlertDialogTitle>Create workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Create a workspace to collaborate with your team.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-4 px-6 pb-2">
            <Field data-invalid={!!form.nameError}>
              <Label htmlFor="create-organization-name">Name</Label>
              <Input
                aria-invalid={!!form.nameError}
                autoFocus
                disabled={isPending}
                id="create-organization-name"
                name="name"
                onChange={(event) => handleNameChange(event.target.value)}
                onInvalid={(event) => {
                  event.preventDefault()
                  setForm((current) => ({
                    ...current,
                    nameError: "Name is required",
                  }))
                }}
                placeholder="Acme Inc."
                required
                value={form.name}
              />
              <FieldError>{form.nameError}</FieldError>
            </Field>

            <OrganizationSlugField
              disabled={isPending}
              onChange={(value) => {
                setForm((current) => ({
                  ...current,
                  slug: value,
                  slugEdited: true,
                }))
              }}
              value={form.slug}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogClose
              render={
                <Button disabled={isPending} type="button" variant="outline" />
              }
            >
              Cancel
            </AlertDialogClose>
            <Button disabled={isPending} type="submit">
              {isPending ? <Spinner /> : null}
              Create workspace
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogPopup>
    </AlertDialog>
  )
}
