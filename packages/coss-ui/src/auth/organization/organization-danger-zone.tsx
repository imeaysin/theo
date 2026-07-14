"use client"

import { useOrganizationPermission } from "@workspace/auth/react"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"
import { DangerZoneRowSkeleton } from "./danger-zone-row"
import { DeleteOrganization } from "./delete-organization"
import { LeaveOrganization } from "./leave-organization"
import { organizationUiPermissions } from "./ui-permissions"

export type OrganizationDangerZoneProps = {
  className?: string
}

export function OrganizationDangerZone({
  className,
}: OrganizationDangerZoneProps) {
  const { data: deletePermission, isPending: deletePermissionPending } =
    useOrganizationPermission(organizationUiPermissions.deleteOrganization)

  const canDelete = !!deletePermission?.success

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <h2 className="mb-3 text-sm font-semibold text-destructive">
        Danger zone
      </h2>

      <Card>
        <CardPanel className="p-4">
          <LeaveOrganization />

          {deletePermissionPending ? <DangerZoneRowSkeleton /> : null}

          {!deletePermissionPending && canDelete ? (
            <>
              <Separator className="my-3" />
              <DeleteOrganization />
            </>
          ) : null}
        </CardPanel>
      </Card>
    </div>
  )
}
