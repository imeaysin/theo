"use client"

import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth,
  useAuthPlugin,
  useUpdateOrganization,
} from "@better-auth-ui/react"
import type { Organization } from "better-auth/client"
import { type SyntheticEvent, useState } from "react"
import { toast } from "sonner"

import { Button } from "@workspace/ui-shadcn/components/button"
import { Card, CardContent } from "@workspace/ui-shadcn/components/card"
import { Field, FieldError } from "@workspace/ui-shadcn/components/field"
import { Input } from "@workspace/ui-shadcn/components/input"
import { Label } from "@workspace/ui-shadcn/components/label"
import { Skeleton } from "@workspace/ui-shadcn/components/skeleton"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { cn } from "@workspace/ui-shadcn/lib/utils"
import { ChangeOrganizationLogo } from "@/features/auth/components/organization/change-organization-logo"
import { SlugField } from "@/features/auth/components/organization/slug-field"

export type OrganizationProfileProps = {
  className?: string
}

type OrganizationProfileFormProps = {
  activeOrganization: Organization
  isPending: boolean
  onSubmit: (data: { name: string; slug: string }) => void
  saveLabel: string
}

function OrganizationProfileForm({
  activeOrganization,
  isPending,
  onSubmit,
  saveLabel,
}: OrganizationProfileFormProps) {
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const [slug, setSlug] = useState(activeOrganization.slug)

  const nameInputId = `${activeOrganization.id}-name`
  const slugInputId = `${activeOrganization.id}-slug`

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string

    onSubmit({ name, slug })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <ChangeOrganizationLogo />

      <Field>
        <Label htmlFor={nameInputId}>{organizationLocalization.name}</Label>

        <Input
          id={nameInputId}
          name="name"
          defaultValue={activeOrganization.name}
          autoComplete="organization"
          placeholder={organizationLocalization.namePlaceholder}
          disabled={isPending}
        />

        <FieldError />
      </Field>

      <SlugField
        id={slugInputId}
        value={slug}
        onChange={setSlug}
        currentSlug={activeOrganization.slug}
        disabled={isPending}
      />

      <Button
        type="submit"
        disabled={isPending}
        size="sm"
        className="mt-1 w-fit"
      >
        {isPending && <Spinner />}

        {saveLabel}
      </Button>
    </form>
  )
}

/**
 * Profile card for the active organization: logo (when enabled), display name, and slug.
 */
export function OrganizationProfile({ className }: OrganizationProfileProps) {
  const { authClient, localization } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { data: activeOrganization } = useActiveOrganization(
    authClient as OrganizationAuthClient
  )

  const { mutate: commitOrganizationUpdate, isPending } = useUpdateOrganization(
    authClient as OrganizationAuthClient,
    {
      onSuccess: () =>
        toast.success(organizationLocalization.organizationUpdatedSuccess),
    }
  )

  function handleSubmit(data: { name: string; slug: string }) {
    commitOrganizationUpdate({ data })
  }

  return (
    <div>
      <h2 className={cn("mb-3 text-sm font-semibold")}>
        {organizationLocalization.organizationProfile}
      </h2>

      <Card className={className}>
        <CardContent>
          {activeOrganization ? (
            <OrganizationProfileForm
              key={activeOrganization.id}
              activeOrganization={activeOrganization}
              isPending={isPending}
              onSubmit={handleSubmit}
              saveLabel={localization.settings.saveChanges}
            />
          ) : (
            <div className="flex flex-col gap-4">
              <Field>
                <Label>{organizationLocalization.name}</Label>
                <Skeleton className="h-8 w-full rounded-md" />
              </Field>

              <Field>
                <Label>{organizationLocalization.slug}</Label>
                <Skeleton className="h-8 w-full rounded-md" />
              </Field>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
