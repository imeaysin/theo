"use client"

import { useActiveOrganization } from "@workspace/auth/react"
import { useState } from "react"
import { DangerZoneRow } from "./danger-zone-row"
import { LeaveOrganizationDialog } from "./leave-organization-dialog"

export function LeaveOrganization() {
  const { data: activeOrganization } = useActiveOrganization()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <DangerZoneRow
        actionLabel="Leave workspace"
        description="Remove yourself from this workspace."
        disabled={!activeOrganization}
        onAction={() => setConfirmOpen(true)}
        title="Leave workspace"
      />

      {activeOrganization ? (
        <LeaveOrganizationDialog
          onOpenChange={setConfirmOpen}
          open={confirmOpen}
          organization={activeOrganization}
        />
      ) : null}
    </>
  )
}
