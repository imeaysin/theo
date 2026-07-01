"use client"

import {
  useActiveOrganization,
  useOrganizationPermission,
} from "@workspace/auth/react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardFooter, CardPanel } from "@workspace/ui/components/card"
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
  onSlugChange?: (value: string) => void
  onSlugBlur?: () => void
  slugError?: string
  onSubmit?: () => void
  isPending?: boolean
}

function OrganizationProfileSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn(className)}>
      <CardPanel className="flex flex-col gap-4">
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
  onSlugChange,
  onSlugBlur,
  slugError,
  onSubmit,
  isPending = false,
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
      <Form key={activeOrganization.id} onSubmit={onSubmit}>
        <Card className={cn(className)}>
          <CardPanel className="flex flex-col gap-4">
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
              currentSlug={activeOrganization.slug}
              disabled={isPending || readOnly}
              error={slugError}
              id={slugInputId}
              onBlur={onSlugBlur}
              onChange={(value) => onSlugChange?.(value)}
              value={slug}
            />
          </CardPanel>

          <CardFooter>
            {readOnly ? null : (
              <Button loading={isPending} size="sm" type="submit">
                Save changes
              </Button>
            )}
          </CardFooter>
        </Card>
      </Form>
    </div>
  )
}
