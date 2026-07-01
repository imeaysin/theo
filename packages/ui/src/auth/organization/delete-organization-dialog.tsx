"use client"

import { useAuthUiConfig, useDeleteOrganization } from "@workspace/auth/react"
import { TriangleAlert } from "lucide-react"
import { type SyntheticEvent } from "react"
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

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
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
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogPopup>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive sm:mx-0">
              <TriangleAlert aria-hidden="true" className="size-5" />
            </div>
            <AlertDialogTitle>Delete workspace</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone.
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
            <Button disabled={isPending} type="submit" variant="destructive">
              {isPending ? <Spinner /> : null}
              Delete workspace
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogPopup>
    </AlertDialog>
  )
}
