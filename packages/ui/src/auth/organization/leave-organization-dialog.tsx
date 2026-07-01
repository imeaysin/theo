"use client"

import { useAuthUiConfig, useLeaveOrganization } from "@workspace/auth/react"
import { LogOut } from "lucide-react"
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
import { Spinner } from "@workspace/ui/components/spinner"
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
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive sm:mx-0">
            <LogOut aria-hidden="true" className="size-5" />
          </div>
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
            disabled={isPending}
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
            variant="destructive"
          >
            {isPending ? <Spinner /> : null}
            Leave workspace
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}
