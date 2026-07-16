"use client"

import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useListOrganizations,
} from "@better-auth-ui/react"
import { useState } from "react"

import { Button } from "@workspace/ui-shadcn/components/button"
import { Card, CardContent } from "@workspace/ui-shadcn/components/card"
import { Separator } from "@workspace/ui-shadcn/components/separator"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { CreateOrganizationDialog } from "@/features/auth/components/organization/create-organization-dialog"
import { OrganizationRow } from "@/features/auth/components/organization/organization-row"
import { OrganizationViewSkeleton } from "@/features/auth/components/organization/organization-view-skeleton"
import { OrganizationsEmpty } from "@/features/auth/components/organization/organizations-empty"

export type OrganizationsProps = {
  className?: string
}

/**
 * Lists organizations the user belongs to (via `useListOrganizations`): loading skeleton,
 * empty state with create, or a card of rows with a Manage control per organization.
 * Owns `CreateOrganizationDialog` open state and the create actions.
 */
export function Organizations({ className }: OrganizationsProps) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const [createOpen, setCreateOpen] = useState(false)

  const { data: organizations, isPending: organizationsPending } =
    useListOrganizations(authClient as OrganizationAuthClient)

  function renderCardContent() {
    if (organizationsPending) {
      return (
        <div className="p-4">
          <OrganizationViewSkeleton />
        </div>
      )
    }

    if (!organizations?.length) {
      return <OrganizationsEmpty onCreatePress={() => setCreateOpen(true)} />
    }

    return organizations.map((organization, index) => (
      <div key={organization.id}>
        {index > 0 && <Separator />}

        <div className="p-4">
          <OrganizationRow organization={organization} />
        </div>
      </div>
    ))
  }

  return (
    <>
      <div className={className}>
        <div className="flex flex-col gap-3">
          <div className="flex items-end justify-between gap-3">
            <h2 className="truncate text-sm font-semibold">
              {organizationLocalization.organizations}
            </h2>

            <Button
              className="shrink-0"
              size="sm"
              disabled={organizationsPending}
              onClick={() => setCreateOpen(true)}
            >
              {organizationLocalization.createOrganization}
            </Button>
          </div>

          <Card className="p-0">
            <CardContent className="p-0">{renderCardContent()}</CardContent>
          </Card>
        </div>
      </div>

      <CreateOrganizationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </>
  )
}
