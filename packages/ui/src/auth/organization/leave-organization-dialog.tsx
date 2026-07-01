"use client"

import { useAuthUiConfig, useLeaveOrganization } from "@workspace/auth/react"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { toastManager } from "@workspace/ui/components/toast"
import type { Organization } from "@workspace/auth/types/organization"
import { OrganizationView } from "./organization-view"

export interface LeaveOrganizationDialogProps {
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
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave workspace</AlertDialogTitle>
          <AlertDialogDescription>
            You will lose access to this workspace and its resources.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="px-6 pb-2">
          <Card>
            <CardPanel>
              <OrganizationView organization={organization} />
            </CardPanel>
          </Card>
        </div>

        <AlertDialogFooter>
          <AlertDialogClose
            render={
              <Button disabled={isPending} type="button" variant="outline" />
            }
          >
            Cancel
          </AlertDialogClose>
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
                      type: "success",
                    })
                    config.navigate(config.routes.defaultAuthenticated, {
                      replace: true,
                    })
                  },
                }
              )
            }
            type="button"
            variant="destructive"
          >
            Leave workspace
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}
