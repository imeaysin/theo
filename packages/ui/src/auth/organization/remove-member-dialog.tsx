"use client"

import {
  formatOrganizationRoleLabel,
  useRemoveMember,
} from "@workspace/auth/react"
import type { OrganizationMember } from "@workspace/auth/types/organization"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { Spinner } from "@workspace/ui/components/spinner"
import { toastManager } from "@workspace/ui/components/toast"
import { AuthUserView } from "../auth-user-view"

export interface RemoveMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: OrganizationMember
}

export function RemoveMemberDialog({
  open,
  onOpenChange,
  member,
}: RemoveMemberDialogProps) {
  const { mutate: removeMember, isPending } = useRemoveMember()

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive sm:mx-0">
            <Trash2 aria-hidden="true" className="size-5" />
          </div>
          <AlertDialogTitle>Remove member</AlertDialogTitle>
          <AlertDialogDescription>
            This member will lose access to the workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="px-6 pb-2">
          <Card>
            <CardPanel className="flex flex-row items-center justify-between gap-2">
              <AuthUserView user={member.user} />
              <Badge variant="outline">
                {formatOrganizationRoleLabel(member.role)}
              </Badge>
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
          <Button
            disabled={isPending}
            onClick={() =>
              removeMember(
                { memberId: member.id },
                {
                  onSuccess: () => {
                    onOpenChange(false)
                    toastManager.add({
                      title: "Member removed",
                      type: "success",
                    })
                  },
                }
              )
            }
            variant="destructive"
          >
            {isPending ? <Spinner /> : null}
            Remove member
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}
