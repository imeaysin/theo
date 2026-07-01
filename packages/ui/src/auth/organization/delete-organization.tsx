"use client"

import { useActiveOrganization } from "@workspace/auth/react"
import { useState } from "react"
import { DangerZoneRow } from "./danger-zone-row"
import { DeleteOrganizationDialog } from "./delete-organization-dialog"

export function DeleteOrganization() {
  const { data: activeOrganization } = useActiveOrganization()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <DangerZoneRow
        actionLabel="Delete workspace"
        description="Permanently delete this workspace and all of its data."
        disabled={!activeOrganization}
        onAction={() => setConfirmOpen(true)}
        title="Delete workspace"
      />

      {activeOrganization ? (
        <DeleteOrganizationDialog
          onOpenChange={setConfirmOpen}
          open={confirmOpen}
          organization={activeOrganization}
        />
      ) : null}
    </>
  )
}
