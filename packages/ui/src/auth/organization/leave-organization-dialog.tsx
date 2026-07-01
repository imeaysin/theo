"use client"

import { useAuthUiConfig, useLeaveOrganization } from "@workspace/auth/react"
import type { Organization } from "@workspace/auth/types/organization"
import { LogOut } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { toastManager } from "@workspace/ui/components/toast"
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
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Leave workspace</DialogTitle>
          <DialogDescription>
            You will lose access to this workspace and its resources.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
            <OrganizationView organization={organization} />
          </div>
        </DialogPanel>

        <DialogFooter>
          <DialogClose
            render={
              <Button disabled={isPending} type="button" variant="outline" />
            }
          >
            Cancel
          </DialogClose>
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
            <LogOut />
            Leave workspace
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}
