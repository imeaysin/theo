"use client"

import { useActiveOrganization } from "@workspace/auth/react"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { LeaveOrganizationDialog } from "./leave-organization-dialog"

export function LeaveOrganization() {
  const { data: activeOrganization } = useActiveOrganization()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm leading-tight font-medium">Leave workspace</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Remove yourself from this workspace.
        </p>
      </div>

      <Button
        className="text-destructive"
        disabled={!activeOrganization}
        onClick={() => setConfirmOpen(true)}
        size="sm"
        variant="outline"
      >
        Leave workspace
      </Button>

      {activeOrganization ? (
        <LeaveOrganizationDialog
          onOpenChange={setConfirmOpen}
          open={confirmOpen}
          organization={activeOrganization}
        />
      ) : null}
    </div>
  )
}
