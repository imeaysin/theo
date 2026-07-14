"use client"

import type { OrganizationSlugAvailabilityState } from "./organization-slug-field"
import {
  useActiveOrganization,
  useOrganizationPermission,
} from "@workspace/auth/react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { Controller, useFormState, type Control } from "react-hook-form"
import { OrganizationSlugField } from "./organization-slug-field"
import { organizationUiPermissions } from "./ui-permissions"

type OrganizationProfileValues = { name: string; slug: string }

export type OrganizationProfileProps = {
  className?: string
  control?: Control<OrganizationProfileValues>
  currentSlug?: string
  onSlugBlur?: () => void
  checkSlugAvailability?: boolean
  onSlugAvailabilityChange?: (state: OrganizationSlugAvailabilityState) => void
  slugAvailabilityError?: string
  onSubmit?: () => void
  isPending?: boolean
  canSubmit?: boolean
}

function OrganizationProfileSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn(className)}>
      <CardPanel className="flex flex-col gap-4 p-4">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Skeleton>
            <Input className="invisible" nativeInput />
          </Skeleton>
        </Field>
        <Field>
          <FieldLabel>Slug</FieldLabel>
          <Skeleton>
            <Input className="invisible" nativeInput />
          </Skeleton>
        </Field>
      </CardPanel>
    </Card>
  )
}

export function OrganizationProfile({
  className,
  control,
  currentSlug,
  onSlugBlur,
  checkSlugAvailability = true,
  onSlugAvailabilityChange,
  slugAvailabilityError,
  onSubmit,
  isPending = false,
  canSubmit = true,
}: OrganizationProfileProps) {
  const { data: activeOrganization } = useActiveOrganization()
  const { data: canUpdateOrganization, isPending: permissionPending } =
    useOrganizationPermission(organizationUiPermissions.updateOrganization)
  const readOnly = !canUpdateOrganization?.success
  const wired = onSubmit != null && control != null
  const { errors } = useFormState({ control, disabled: !control })

  if (!activeOrganization || permissionPending || !wired) {
    return (
      <div>
        <h2 className="mb-3 text-sm font-semibold">Profile</h2>
        <OrganizationProfileSkeleton className={className} />
      </div>
    )
  }

  const nameInputId = `${activeOrganization.id}-name`
  const slugInputId = `${activeOrganization.id}-slug`

  const formErrors: Record<string, string> = {}
  if (errors.name?.message) formErrors.name = errors.name.message

  const slugMessage = slugAvailabilityError ?? errors.slug?.message
  if (slugMessage) formErrors.slug = slugMessage

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">Profile</h2>
      <Form
        key={activeOrganization.id}
        errors={Object.keys(formErrors).length > 0 ? formErrors : undefined}
        onSubmit={onSubmit}
      >
        <Card className={cn(className)}>
          <CardPanel className="flex flex-col gap-4 p-4">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Field name="name">
                  <FieldLabel htmlFor={nameInputId}>Name</FieldLabel>
                  <Input
                    {...field}
                    autoComplete="organization"
                    disabled={isPending || readOnly}
                    id={nameInputId}
                    placeholder="Acme Inc."
                    type="text"
                  />
                  <FieldError />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="slug"
              render={({ field }) => (
                <OrganizationSlugField
                  checkAvailability={checkSlugAvailability}
                  currentSlug={currentSlug ?? activeOrganization.slug}
                  disabled={isPending || readOnly}
                  id={slugInputId}
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

            {readOnly ? null : (
              <Button
                className="w-fit"
                disabled={!canSubmit}
                loading={isPending}
                size="sm"
                type="submit"
              >
                Save changes
              </Button>
            )}
          </CardPanel>
        </Card>
      </Form>
    </div>
  )
}
