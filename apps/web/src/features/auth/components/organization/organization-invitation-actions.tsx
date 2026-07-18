"use client"

import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useCancelInvitation,
  useHasPermission,
} from "@better-auth-ui/react"
import type { Invitation } from "better-auth/client"
import { X } from "lucide-react"

import { Button } from "@workspace/ui-shadcn/components/button"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { organizationPlugin } from "@/lib/auth/organization-plugin"

export type OrganizationInvitationActionsProps = {
  invitation: Invitation
}

export function OrganizationInvitationActions({
  invitation,
}: OrganizationInvitationActionsProps) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const {
    data: cancelInvitationPermission,
    isPending: cancelPermissionPending,
  } = useHasPermission(authClient as OrganizationAuthClient, {
    permissions: { invitation: ["cancel"] },
  })

  const { mutate: cancelInvitation, isPending: cancelPending } =
    useCancelInvitation(authClient as OrganizationAuthClient)

  if (cancelPermissionPending) {
    return <Spinner className="size-4" />
  }

  if (!cancelInvitationPermission?.success || invitation.status !== "pending") {
    return null
  }

  return (
    <Button
      size="icon-sm"
      variant="outline"
      className="text-destructive"
      disabled={cancelPending}
      onClick={() => cancelInvitation({ invitationId: invitation.id })}
      aria-label={organizationLocalization.cancelInvitation}
    >
      {cancelPending ? <Spinner /> : <X />}
    </Button>
  )
}
