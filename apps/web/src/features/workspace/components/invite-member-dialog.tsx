import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@workspace/auth/client"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui-shadcn/components/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui-shadcn/components/field"
import { Input } from "@workspace/ui-shadcn/components/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui-shadcn/components/select"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import {
  ASSIGNABLE_ORG_ROLES,
  formatRoleLabel,
} from "@/features/workspace/lib/org-roles"

const InviteSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  role: z.string().min(1, "Select a role"),
})

type InviteValues = z.infer<typeof InviteSchema>

type InviteMemberDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly roleOptions: readonly string[]
  readonly onInvited: () => void
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  roleOptions,
  onInvited,
}: InviteMemberDialogProps) {
  const [isPending, setIsPending] = useState(false)
  const options = useMemo(
    () => (roleOptions.length > 0 ? roleOptions : ASSIGNABLE_ORG_ROLES),
    [roleOptions]
  )

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
        {open ? (
          <InviteMemberForm
            isPending={isPending}
            onInvited={onInvited}
            onOpenChange={onOpenChange}
            onPendingChange={setIsPending}
            options={options}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

type InviteMemberFormProps = {
  readonly options: readonly string[]
  readonly isPending: boolean
  readonly onPendingChange: (pending: boolean) => void
  readonly onInvited: () => void
  readonly onOpenChange: (open: boolean) => void
}

function InviteMemberForm({
  options,
  isPending,
  onPendingChange,
  onInvited,
  onOpenChange,
}: InviteMemberFormProps) {
  const form = useForm<InviteValues>({
    resolver: zodResolver(InviteSchema),
    defaultValues: { email: "", role: options[0] ?? "member" },
  })

  async function handleSubmit(values: InviteValues) {
    onPendingChange(true)
    const result = await authClient.organization.inviteMember({
      email: values.email,
      role: values.role,
    })
    onPendingChange(false)
    if (result.error) {
      toast.error(result.error.message ?? "Could not send invitation")
      return
    }
    toast.success(`Invitation sent to ${values.email}`)
    onInvited()
    onOpenChange(false)
  }

  const emailError = form.formState.errors.email
  const roleError = form.formState.errors.role

  return (
    <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
      <DialogHeader>
        <DialogTitle>Invite member</DialogTitle>
        <DialogDescription>
          Send an email invitation with a starting role. They must accept the
          link to join.
        </DialogDescription>
      </DialogHeader>
      <FieldGroup className="py-4">
        <Field data-invalid={emailError ? true : undefined}>
          <FieldLabel htmlFor="invite-email">Email</FieldLabel>
          <Input
            disabled={isPending}
            id="invite-email"
            placeholder="teammate@company.com"
            type="email"
            {...form.register("email")}
          />
          <FieldError errors={[emailError]} />
        </Field>
        <Field data-invalid={roleError ? true : undefined}>
          <FieldLabel htmlFor="invite-role">Role</FieldLabel>
          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <Select
                disabled={isPending}
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger id="invite-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {options.map((role) => (
                      <SelectItem key={role} value={role}>
                        {formatRoleLabel(role)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[roleError]} />
        </Field>
      </FieldGroup>
      <DialogFooter>
        <DialogClose
          disabled={isPending}
          render={<Button type="button" variant="outline" />}
        >
          Cancel
        </DialogClose>
        <Button disabled={isPending} type="submit">
          {isPending ? <Spinner data-icon="inline-start" /> : null}
          Send invite
        </Button>
      </DialogFooter>
    </form>
  )
}
