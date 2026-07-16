import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@workspace/auth/client"
import { Button } from "@workspace/ui-shadcn/components/button"
import { Checkbox } from "@workspace/ui-shadcn/components/checkbox"
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
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import type { OrgRole } from "@/features/organization/hooks/use-org-roles"
import {
  ROLE_PERMISSION_CATALOG,
  isPermissionResource,
  type PermissionResource,
} from "@/features/organization/lib/org-roles"

const RoleNameSchema = z.object({
  role: z
    .string()
    .trim()
    .min(2, "Role name is required")
    .max(40)
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_-]*$/,
      "Use letters, numbers, - or _ (stored lowercase)"
    )
    .transform((value) => value.toLowerCase()),
})

type RoleNameValues = z.infer<typeof RoleNameSchema>

type RoleFormDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly editingRole: OrgRole | null
  readonly onSaved: () => void
}

type PermissionState = Partial<Record<PermissionResource, Set<string>>>

function emptyPermissionState(): PermissionState {
  return {}
}

function permissionStateFromRole(role: OrgRole | null): PermissionState {
  const next = emptyPermissionState()
  if (!role) return next
  for (const [resource, actions] of Object.entries(role.permission)) {
    if (!isPermissionResource(resource)) continue
    next[resource] = new Set(actions)
  }
  return next
}

function toPermissionPayload(state: PermissionState): Record<string, string[]> {
  const permission: Record<string, string[]> = {}
  for (const [resource, actions] of Object.entries(state)) {
    if (!isPermissionResource(resource) || !actions || actions.size === 0) {
      continue
    }
    permission[resource] = [...actions]
  }
  return permission
}

export function RoleFormDialog({
  open,
  onOpenChange,
  editingRole,
  onSaved,
}: RoleFormDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        {open ? (
          <RoleFormBody
            key={editingRole?.id ?? "new-role"}
            editingRole={editingRole}
            onOpenChange={onOpenChange}
            onSaved={onSaved}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

type RoleFormBodyProps = {
  readonly editingRole: OrgRole | null
  readonly onOpenChange: (open: boolean) => void
  readonly onSaved: () => void
}

function RoleFormBody({
  editingRole,
  onOpenChange,
  onSaved,
}: RoleFormBodyProps) {
  const isEditing = Boolean(editingRole)
  const [isPending, setIsPending] = useState(false)
  const [permissionState, setPermissionState] = useState(() =>
    permissionStateFromRole(editingRole)
  )
  const form = useForm<RoleNameValues>({
    resolver: zodResolver(RoleNameSchema),
    defaultValues: { role: editingRole?.role ?? "" },
  })

  function toggleAction(resource: PermissionResource, action: string) {
    setPermissionState((current) => {
      const set = new Set(current[resource] ?? [])
      if (set.has(action)) set.delete(action)
      else set.add(action)
      return { ...current, [resource]: set }
    })
  }

  async function handleSubmit(values: RoleNameValues) {
    const permission = toPermissionPayload(permissionState)
    if (Object.keys(permission).length === 0) {
      toast.error("Select at least one permission")
      return
    }

    setIsPending(true)
    if (isEditing && editingRole) {
      const result = await authClient.organization.updateRole({
        roleId: editingRole.id,
        data: {
          permission,
          roleName: values.role,
        },
      })
      setIsPending(false)
      if (result.error) {
        toast.error(result.error.message ?? "Could not update role")
        return
      }
      toast.success("Role updated")
    } else {
      const result = await authClient.organization.createRole({
        role: values.role,
        permission,
      })
      setIsPending(false)
      if (result.error) {
        toast.error(result.error.message ?? "Could not create role")
        return
      }
      toast.success("Role created")
    }

    onSaved()
    onOpenChange(false)
  }

  const nameError = form.formState.errors.role

  return (
    <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit custom role" : "Create custom role"}
        </DialogTitle>
        <DialogDescription>
          Permissions must be a subset of what you already have in this
          organization.
        </DialogDescription>
      </DialogHeader>

      <FieldGroup className="max-h-[60vh] overflow-y-auto py-4">
        <Field data-invalid={nameError ? true : undefined}>
          <FieldLabel htmlFor="role-name">Role name</FieldLabel>
          <Input
            disabled={isPending}
            id="role-name"
            placeholder="support"
            {...form.register("role")}
          />
          <FieldError errors={[nameError]} />
        </Field>

        {Object.entries(ROLE_PERMISSION_CATALOG).map(([resource, actions]) => {
          if (!isPermissionResource(resource)) return null
          return (
            <Field key={resource}>
              <FieldLabel>{resource}</FieldLabel>
              <div className="flex flex-wrap gap-3 pt-1">
                {actions.map((action) => {
                  const checked =
                    permissionState[resource]?.has(action) ?? false
                  return (
                    <label
                      className="flex items-center gap-2 text-sm"
                      key={`${resource}-${action}`}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={isPending}
                        onCheckedChange={() => toggleAction(resource, action)}
                      />
                      {action}
                    </label>
                  )
                })}
              </div>
            </Field>
          )
        })}
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
          {isEditing ? "Save role" : "Create role"}
        </Button>
      </DialogFooter>
    </form>
  )
}
