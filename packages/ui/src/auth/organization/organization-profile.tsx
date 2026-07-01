"use client"

import type { SubmitEventHandler } from "react"
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
import { OrganizationSlugField } from "./organization-slug-field"
import { organizationUiPermissions } from "./ui-permissions"

export interface OrganizationProfileProps {
  className?: string
  name?: string
  onNameChange?: (value: string) => void
  nameError?: string
  slug?: string
  currentSlug?: string
  onSlugChange?: (value: string) => void
  onSlugBlur?: () => void
  slugError?: string
  checkSlugAvailability?: boolean
  onSlugAvailabilityChange?: (state: OrganizationSlugAvailabilityState) => void
  onSubmit?: SubmitEventHandler<HTMLFormElement>
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
  name = "",
  onNameChange,
  nameError,
  slug = "",
  currentSlug,
  onSlugChange,
  onSlugBlur,
  slugError,
  checkSlugAvailability = true,
  onSlugAvailabilityChange,
  onSubmit,
  isPending = false,
  canSubmit = true,
}: OrganizationProfileProps) {
  const { data: activeOrganization } = useActiveOrganization()
  const { data: canUpdateOrganization, isPending: permissionPending } =
    useOrganizationPermission(organizationUiPermissions.updateOrganization)
  const readOnly = !canUpdateOrganization?.success
  const wired = onSubmit != null

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

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">Profile</h2>
      <Form
        key={activeOrganization.id}
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(event)
        }}
      >
        <Card className={cn(className)}>
          <CardPanel className="flex flex-col gap-4 p-4">
            <Field data-invalid={!!nameError}>
              <FieldLabel htmlFor={nameInputId}>Name</FieldLabel>
              <Input
                aria-invalid={!!nameError}
                autoComplete="organization"
                disabled={isPending || readOnly}
                id={nameInputId}
                onChange={(event) => onNameChange?.(event.target.value)}
                placeholder="Acme Inc."
                type="text"
                value={name}
              />
              <FieldError>{nameError}</FieldError>
            </Field>

            <OrganizationSlugField
              checkAvailability={checkSlugAvailability}
              currentSlug={currentSlug ?? activeOrganization.slug}
              disabled={isPending || readOnly}
              error={slugError}
              id={slugInputId}
              onAvailabilityChange={onSlugAvailabilityChange}
              onBlur={onSlugBlur}
              onChange={(value) => onSlugChange?.(value)}
              value={slug}
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
