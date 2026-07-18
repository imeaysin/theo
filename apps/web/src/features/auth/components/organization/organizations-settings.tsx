"use client"

import { useState, type ComponentProps } from "react"
import { useAuthPlugin } from "@better-auth-ui/react"

import { Button } from "@workspace/ui-shadcn/components/button"
import { cn } from "@workspace/ui-shadcn/lib/utils"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { PageHeader } from "@/components/page-header"
import { Organizations } from "@/features/auth/components/organization/organizations"
import { UserInvitations } from "@/features/auth/components/organization/user-invitations"

export type OrganizationsSettingsProps = {
  className?: string
}

/**
 * Organizations settings panel: orgs list + pending invitations.
 */
export function OrganizationsSettings({
  className,
  ...props
}: OrganizationsSettingsProps & ComponentProps<"div">) {
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className={cn("flex w-full flex-col gap-6", className)} {...props}>
      <PageHeader
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            {organizationLocalization.createOrganization}
          </Button>
        }
        description={organizationLocalization.organizationsDescription}
        title={organizationLocalization.organizations}
      />
      <Organizations
        createOpen={createOpen}
        hideHeader
        onCreateOpenChange={setCreateOpen}
      />
      <UserInvitations />
    </div>
  )
}
