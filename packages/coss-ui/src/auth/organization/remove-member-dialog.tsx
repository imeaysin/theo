"use client"

import { formatOrganizationRoleLabel } from "@workspace/auth/permissions/organization"
import { useRemoveMember } from "@workspace/auth/react"
import type { OrganizationMember } from "@workspace/auth/types/organization"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { Pane } from "@workspace/ui/components/pane"
import { toastManager } from "@workspace/ui/components/toast"
import { AuthUserView } from "../auth-user-view"

export type RemoveMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: OrganizationMember
}

export function RemoveMemberDialog({
  open,
  onOpenChange,
  member,
}: RemoveMemberDialogProps) {
  const { mutate: removeMember, isPending } = useRemoveMember()

  return (
    <Pane.Alert onOpenChange={onOpenChange} open={open}>
      <Pane.Alert.Content>
        <Pane.Alert.Header>
          <Pane.Alert.Title>Remove member</Pane.Alert.Title>
          <Pane.Alert.Description>
            This member will lose access to the workspace.
          </Pane.Alert.Description>
        </Pane.Alert.Header>

        <div className="px-6 pb-2">
          <Card>
            <CardPanel className="flex flex-row items-center justify-between gap-2">
              <AuthUserView user={member.user} />
              <Badge variant="outline">
                {formatOrganizationRoleLabel(member.role)}
              </Badge>
            </CardPanel>
          </Card>
        </div>

        <Pane.Alert.Footer>
          <Pane.Alert.Close
            render={
              <Button disabled={isPending} type="button" variant="outline" />
            }
          >
            Cancel
          </Pane.Alert.Close>
          <Button
            loading={isPending}
            onClick={() =>
              removeMember(
                { memberId: member.id },
                {
                  onSuccess: () => {
                    onOpenChange(false)
                    toastManager.add({
                      title: "Member removed",
                      description: "The member has been removed.",
                      type: "success",
                    })
                  },
                  onError: () => {
                    toastManager.add({
                      title: "Could not remove member",
                      description: "Please try again.",
                      type: "error",
                    })
                  },
                }
              )
            }
            type="button"
            variant="destructive"
          >
            Remove member
          </Button>
        </Pane.Alert.Footer>
      </Pane.Alert.Content>
    </Pane.Alert>
  )
}
