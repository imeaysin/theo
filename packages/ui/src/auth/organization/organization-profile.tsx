"use client"

import {
  useActiveOrganization,
  useUpdateOrganization,
} from "@workspace/auth/react"
import type { Organization } from "@workspace/auth/types/organization"
import { type SyntheticEvent, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardFooter, CardPanel } from "@workspace/ui/components/card"
import { Field, FieldError } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Spinner } from "@workspace/ui/components/spinner"
import { toastManager } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import { OrganizationSlugField } from "./organization-slug-field"

interface OrganizationProfileFormProps {
  organization: Organization
  className?: string
}

function OrganizationProfileForm({
  organization,
  className,
}: OrganizationProfileFormProps) {
  const { mutate: updateOrganization, isPending } = useUpdateOrganization()
  const [slug, setSlug] = useState(organization.slug ?? "")
  const [nameError, setNameError] = useState<string>()

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    updateOrganization(
      {
        name: formData.get("name") as string,
        slug,
      },
      {
        onSuccess: () => {
          toastManager.add({
            title: "Workspace updated",
            type: "success",
          })
        },
      }
    )
  }

  const nameInputId = `${organization.id}-name`
  const slugInputId = `${organization.id}-slug`

  return (
    <form onSubmit={handleSubmit}>
      <Card className={cn(className)}>
        <CardPanel className="flex flex-col gap-4">
          <Field data-invalid={!!nameError}>
            <Label htmlFor={nameInputId}>Name</Label>
            <Input
              aria-invalid={!!nameError}
              autoComplete="organization"
              defaultValue={organization.name ?? ""}
              disabled={isPending}
              id={nameInputId}
              name="name"
              onChange={() => setNameError(undefined)}
              onInvalid={(event) => {
                event.preventDefault()
                setNameError("Name is required")
              }}
              placeholder="Acme Inc."
              required
            />
            <FieldError>{nameError}</FieldError>
          </Field>

          <OrganizationSlugField
            currentSlug={organization.slug}
            disabled={isPending}
            id={slugInputId}
            onChange={setSlug}
            value={slug}
          />
        </CardPanel>

        <CardFooter>
          <Button disabled={isPending} size="sm" type="submit">
            {isPending ? <Spinner /> : null}
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export interface OrganizationProfileProps {
  className?: string
}

export function OrganizationProfile({ className }: OrganizationProfileProps) {
  const { data: activeOrganization } = useActiveOrganization()

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">Profile</h2>

      {activeOrganization ? (
        <OrganizationProfileForm
          key={activeOrganization.id}
          className={className}
          organization={activeOrganization}
        />
      ) : (
        <Card className={cn(className)}>
          <CardPanel className="flex flex-col gap-4">
            <Field>
              <Label>Name</Label>
              <Skeleton>
                <Input className="invisible" />
              </Skeleton>
            </Field>
            <Field>
              <Label>Slug</Label>
              <Skeleton>
                <Input className="invisible" />
              </Skeleton>
            </Field>
          </CardPanel>
        </Card>
      )}
    </div>
  )
}
