"use client"

import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth,
  useListOrganizationMembers,
  useSession,
} from "@better-auth-ui/react"

import { ApiKeys } from "./api-keys"

export type OrganizationApiKeysProps = {
  className?: string
}

/**
 * {@link ApiKeys} scoped to the active organization.
 *
 * Hidden for members whose role isn't `owner`. Better Auth's
 * `/organization/has-permission` endpoint isn't usable for `apiKey:*` checks
 * (it doesn't pass `allowCreatorAllPermissions` and the default org AC has no
 * `apiKey` statements), so we gate on role directly.
 *
 * Keys authenticate Better Auth api-key flows for the organization — they do
 * not grant cookie sessions for Nest `/v1` business routes.
 */
export function OrganizationApiKeys({ className }: OrganizationApiKeysProps) {
  const { authClient } = useAuth()
  const { data: session } = useSession(authClient)

  const { data: activeOrganization, isPending: activeOrganizationPending } =
    useActiveOrganization(authClient as OrganizationAuthClient)

  const { data: membersData } = useListOrganizationMembers(
    authClient as OrganizationAuthClient
  )

  const canManageApiKeys = membersData?.members.some(
    (member) => member.role === "owner" && member.userId === session?.user.id
  )

  if (!canManageApiKeys) {
    return null
  }

  return (
    <div className={className}>
      <p className="mb-4 text-sm text-muted-foreground">
        Organization API keys are for Better Auth api-key features. They do not
        authenticate Nest <code className="text-xs">/v1</code> routes — those
        use cookie sessions.
      </p>
      <ApiKeys
        organizationId={activeOrganization?.id}
        isPending={activeOrganizationPending}
      />
    </div>
  )
}
