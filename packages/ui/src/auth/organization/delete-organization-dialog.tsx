"use client"

import { useAuthUiConfig, useDeleteOrganization } from "@workspace/auth/react"
import type { Organization } from "@workspace/auth/types/organization"
import { TriangleAlert } from "lucide-react"
import type { SubmitEventHandler } from "react"
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
import { Form } from "@workspace/ui/components/form"
import { toastManager } from "@workspace/ui/components/toast"
import { OrganizationView } from "./organization-view"

export interface DeleteOrganizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organization: Organization
}

export function DeleteOrganizationDialog({
  open,
  onOpenChange,
  organization,
}: DeleteOrganizationDialogProps) {
  const config = useAuthUiConfig()
  const { mutate: deleteOrganization, isPending } = useDeleteOrganization()

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    deleteOrganization(
      { organizationId: organization.id },
      {
        onSuccess: () => {
          onOpenChange(false)
          toastManager.add({
            title: "Workspace deleted",
            type: "success",
          })
          config.navigate(config.routes.defaultAuthenticated, { replace: true })
        },
      }
    )
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPopup>
        <Form className="contents" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Delete workspace</DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone.
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
            <Button loading={isPending} type="submit" variant="destructive">
              <TriangleAlert />
              Delete workspace
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  )
}
