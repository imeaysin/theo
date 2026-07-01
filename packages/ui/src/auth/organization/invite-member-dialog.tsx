"use client"

import {
  useAssignableOrganizationRoles,
  useInviteMember,
} from "@workspace/auth/react"
import { UserPlus } from "lucide-react"
import { type SyntheticEvent, useState } from "react"
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
import { Field, FieldError } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectButton,
  SelectItem,
  SelectPopup,
  SelectValue,
} from "@workspace/ui/components/select"
import { Spinner } from "@workspace/ui/components/spinner"
import { toastManager } from "@workspace/ui/components/toast"

export interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteMemberDialog({
  open,
  onOpenChange,
}: InviteMemberDialogProps) {
  const {
    roles,
    formatOrganizationRoleLabel,
    isPending: rolesPending,
  } = useAssignableOrganizationRoles()
  const { mutate: inviteMember, isPending } = useInviteMember()
  const [role, setRole] = useState<string>("member")
  const [emailError, setEmailError] = useState<string>()

  const defaultRole = roles.includes("member")
    ? "member"
    : (roles.at(-1) ?? "member")
  const selectedRole = roles.includes(role) ? role : defaultRole

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setRole(defaultRole)
      setEmailError(undefined)
    }
    onOpenChange(nextOpen)
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    inviteMember(
      {
        email: (formData.get("email") as string).trim(),
        role: selectedRole,
      },
      {
        onSuccess: () => {
          toastManager.add({
            title: "Invitation sent",
            type: "success",
          })
          handleOpenChange(false)
        },
      }
    )
  }

  return (
    <AlertDialog onOpenChange={handleOpenChange} open={open}>
      <AlertDialogPopup>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted sm:mx-0">
              <UserPlus aria-hidden="true" className="size-5" />
            </div>
            <AlertDialogTitle>Invite member</AlertDialogTitle>
            <AlertDialogDescription>
              Send an invitation to join this workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-4 px-6 pb-2">
            <Field data-invalid={!!emailError}>
              <Label htmlFor="invite-member-email">Email</Label>
              <Input
                aria-invalid={!!emailError}
                autoFocus
                disabled={isPending}
                id="invite-member-email"
                name="email"
                onChange={() => setEmailError(undefined)}
                onInvalid={(event) => {
                  event.preventDefault()
                  setEmailError("Enter a valid email address")
                }}
                placeholder="name@example.com"
                required
                type="email"
              />
              <FieldError>{emailError}</FieldError>
            </Field>

            <Field>
              <Label htmlFor="invite-member-role">Role</Label>
              <Select
                disabled={isPending || rolesPending}
                onValueChange={(value) => setRole(value ?? defaultRole)}
                value={selectedRole}
              >
                <SelectButton className="w-full" id="invite-member-role">
                  <SelectValue />
                </SelectButton>
                <SelectPopup>
                  {roles.map((roleName) => (
                    <SelectItem key={roleName} value={roleName}>
                      {formatOrganizationRoleLabel(roleName)}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </Field>
          </div>

          <AlertDialogFooter>
            <AlertDialogClose
              render={
                <Button disabled={isPending} type="button" variant="outline" />
              }
            >
              Cancel
            </AlertDialogClose>
            <Button disabled={isPending} type="submit">
              {isPending ? <Spinner /> : null}
              Invite member
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogPopup>
    </AlertDialog>
  )
}
