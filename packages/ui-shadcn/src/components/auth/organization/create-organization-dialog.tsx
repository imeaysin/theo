"use client"

import type { OrganizationSlugAvailabilityState } from "./organization-slug-field"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@workspace/ui-shadcn/components/button"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui-shadcn/components/form"
import { Input } from "@workspace/ui-shadcn/components/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@workspace/ui-shadcn/components/sheet"
import { OrganizationSlugField } from "./organization-slug-field"

// ---------------------------------------------------------------------------
// Schema & types
// ---------------------------------------------------------------------------

const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or fewer."),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .max(50, "Slug must be 50 characters or fewer.")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug may only contain lowercase letters, numbers, and hyphens."
    ),
})

type CreateOrganizationValues = z.infer<typeof createOrganizationSchema>

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type CreateOrganizationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSlugBlur?: () => void
  onSlugAvailabilityChange?: (state: OrganizationSlugAvailabilityState) => void
  onSubmit: (values: CreateOrganizationValues) => Promise<void> | void
  required?: boolean
  showSlug?: boolean
  title?: string
  description?: string
  submitLabel?: string
}

// ---------------------------------------------------------------------------
// CreateOrganizationDialog
// ---------------------------------------------------------------------------

export function CreateOrganizationDialog({
  open,
  onOpenChange,
  onSlugBlur,
  onSlugAvailabilityChange,
  onSubmit,
  required = false,
  showSlug = true,
  title = "Create workspace",
  description = "Create a workspace to collaborate with your team.",
  submitLabel = "Create workspace",
}: CreateOrganizationDialogProps) {
  const form = useForm<CreateOrganizationValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: { name: "", slug: "" },
  })

  const isSubmitting = form.formState.isSubmitting

  function handleOpenChange(nextOpen: boolean) {
    if (required && !nextOpen) return
    if (!nextOpen) form.reset()
    onOpenChange(nextOpen)
  }

  async function handleSubmit(values: CreateOrganizationValues) {
    await onSubmit(values)
    form.reset()
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent showCloseButton={!required} side="right">
        <SheetHeader className="border-b px-6 pb-4">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            className="flex min-h-0 flex-1 flex-col"
            noValidate
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        disabled={isSubmitting}
                        placeholder="Acme Inc."
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showSlug ? (
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <OrganizationSlugField
                        disabled={isSubmitting}
                        onAvailabilityChange={onSlugAvailabilityChange}
                        onBlur={() => {
                          field.onBlur()
                          onSlugBlur?.()
                        }}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormItem>
                  )}
                />
              ) : null}
            </div>

            <SheetFooter className="border-t px-6 py-4">
              {required ? null : (
                <SheetClose asChild>
                  <Button
                    disabled={isSubmitting}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </SheetClose>
              )}
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                {submitLabel}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
