"use client"

import { useAuthUiConfig, useLeaveOrganization } from "@workspace/auth/react"
import type { Organization } from "@workspace/auth/types/organization"
import { LogOut } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { Pane } from "@workspace/ui/components/pane"
import { toastManager } from "@workspace/ui/components/toast"
import { OrganizationView } from "./organization-view"

export type LeaveOrganizationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  organization: Organization
}

export function LeaveOrganizationDialog({
  open,
  onOpenChange,
  organization,
}: LeaveOrganizationDialogProps) {
  const config = useAuthUiConfig()
  const { mutate: leaveOrganization, isPending } = useLeaveOrganization()

  return (
    <Pane.Alert onOpenChange={onOpenChange} open={open}>
      <Pane.Alert.Content>
        <Pane.Alert.Header>
          <Pane.Alert.Title>Leave workspace</Pane.Alert.Title>
          <Pane.Alert.Description>
            You will lose access to this workspace and its resources.
          </Pane.Alert.Description>
        </Pane.Alert.Header>

        <div className="px-6 pb-2">
          <Card>
            <CardPanel>
              <OrganizationView organization={organization} />
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
              leaveOrganization(
                { organizationId: organization.id },
                {
                  onSuccess: () => {
                    onOpenChange(false)
                    toastManager.add({
                      title: "Left workspace",
                      description: "You have left the workspace.",
                      type: "success",
                    })
                    config.navigate(config.routes.defaultAuthenticated, {
                      replace: true,
                    })
                  },
                  onError: () => {
                    toastManager.add({
                      title: "Could not leave workspace",
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
            <LogOut />
            Leave workspace
          </Button>
        </Pane.Alert.Footer>
      </Pane.Alert.Content>
    </Pane.Alert>
  )
}
