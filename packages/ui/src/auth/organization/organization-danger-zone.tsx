"use client"

import { useOrganizationPermissionByKey } from "@workspace/auth/react"
import type { ComponentProps } from "react"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { DeleteOrganization } from "./delete-organization"
import { LeaveOrganization } from "./leave-organization"

export interface OrganizationDangerZoneProps {
  className?: string
}

export function OrganizationDangerZone({
  className,
  ...props
}: OrganizationDangerZoneProps & ComponentProps<"div">) {
  const { data: deletePermission, isPending: deletePermissionPending } =
    useOrganizationPermissionByKey("deleteOrganization")

  const canDelete = !!deletePermission?.success

  return (
    <div className={cn("flex w-full flex-col", className)} {...props}>
      <h2 className="mb-3 text-sm font-semibold text-destructive">
        Danger zone
      </h2>

      <Card>
        <CardPanel>
          {deletePermissionPending ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <LeaveOrganization />

              {canDelete ? (
                <>
                  <Separator className="my-4" />
                  <DeleteOrganization />
                </>
              ) : null}
            </>
          )}
        </CardPanel>
      </Card>
    </div>
  )
}
