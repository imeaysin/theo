"use client"

import {
  useActiveOrganization,
  useOrganizationPermissionByKey,
} from "@workspace/auth/react"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { DeleteOrganizationDialog } from "./delete-organization-dialog"

export function DeleteOrganization() {
  const { data: activeOrganization } = useActiveOrganization()
  const { data: permission, isPending: permissionPending } =
    useOrganizationPermissionByKey("deleteOrganization")
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (permissionPending) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-56" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
    )
  }

  if (!permission?.success) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm leading-tight font-medium">Delete workspace</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Permanently delete this workspace and all of its data.
        </p>
      </div>

      <Button
        className="text-destructive"
        disabled={!activeOrganization}
        onClick={() => setConfirmOpen(true)}
        size="sm"
        variant="outline"
      >
        Delete workspace
      </Button>

      {activeOrganization ? (
        <DeleteOrganizationDialog
          onOpenChange={setConfirmOpen}
          open={confirmOpen}
          organization={activeOrganization}
        />
      ) : null}
    </div>
  )
}
