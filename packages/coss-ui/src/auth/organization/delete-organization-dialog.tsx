"use client"

import { useAuthUiConfig, useDeleteOrganization } from "@workspace/auth/react"
import type { Organization } from "@workspace/auth/types/organization"
import { TriangleAlert } from "lucide-react"
import type { SubmitEventHandler } from "react"
import { Button } from "@workspace/ui/components/button"
import { Pane } from "@workspace/ui/components/pane"
import { Form } from "@workspace/ui/components/form"
import { toastManager } from "@workspace/ui/components/toast"
import { OrganizationView } from "./organization-view"

export type DeleteOrganizationDialogProps = {
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
            description: "The workspace has been deleted.",
            type: "success",
          })
          config.navigate(config.routes.defaultAuthenticated, { replace: true })
        },
        onError: () => {
          toastManager.add({
            title: "Could not delete workspace",
            description: "Please try again.",
            type: "error",
          })
        },
      }
    )
  }

  return (
    <Pane onOpenChange={onOpenChange} open={open}>
      <Pane.Content>
        <Form className="contents" onSubmit={handleSubmit}>
          <Pane.Header>
            <Pane.Title>Delete workspace</Pane.Title>
            <Pane.Description>
              This action is permanent and cannot be undone.
            </Pane.Description>
          </Pane.Header>

          <Pane.Panel>
            <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
              <OrganizationView organization={organization} />
            </div>
          </Pane.Panel>

          <Pane.Footer>
            <Pane.Close
              render={
                <Button disabled={isPending} type="button" variant="outline" />
              }
            >
              Cancel
            </Pane.Close>
            <Button loading={isPending} type="submit" variant="destructive">
              <TriangleAlert />
              Delete workspace
            </Button>
          </Pane.Footer>
        </Form>
      </Pane.Content>
    </Pane>
  )
}
