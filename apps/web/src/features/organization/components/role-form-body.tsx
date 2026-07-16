import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Badge } from "@workspace/ui-shadcn/components/badge"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui-shadcn/components/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui-shadcn/components/field"
import { Input } from "@workspace/ui-shadcn/components/input"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import { RolePermissionPicker } from "@/features/organization/components/role-permission-picker"
import type { OrganizationRole } from "@/features/organization/hooks/use-organization-roles"
import {
  ROLE_PERMISSION_CATALOG,
  type PermissionResource,
} from "@/features/organization/lib/organization-roles"
import {
  countSelectedPermissions,
  permissionStateFromRole,
  toPermissionPayload,
} from "@/features/organization/lib/permission-state"
import { saveOrganizationRole } from "@/features/organization/lib/save-organization-role"

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

type RoleFormBodyProps = {
  readonly editingRole: OrganizationRole | null
  readonly onOpenChange: (open: boolean) => void
  readonly onSaved: () => void
}

export function RoleFormBody({
  editingRole,
  onOpenChange,
  onSaved,
}: RoleFormBodyProps) {
  const isEditing = Boolean(editingRole)
  const [isPending, setIsPending] = useState(false)
  const [permissionsSubmitted, setPermissionsSubmitted] = useState(false)
  const [permissionState, setPermissionState] = useState(() =>
    permissionStateFromRole(editingRole?.permission ?? {})
  )
  const form = useForm<RoleNameValues>({
    resolver: zodResolver(RoleNameSchema),
    defaultValues: { role: editingRole?.role ?? "" },
  })
  const roleDraft = useWatch({ control: form.control, name: "role" }) ?? ""
  const normalizedDraft = roleDraft.trim().toLowerCase()
  const selectedCount = countSelectedPermissions(permissionState)
  const nameError = form.formState.errors.role
  const permissionsEmpty = selectedCount === 0
  const showPermissionsError = permissionsSubmitted && permissionsEmpty

  function toggleAction(resource: PermissionResource, action: string) {
    setPermissionState((current) => {
      const set = new Set(current[resource] ?? [])
      if (set.has(action)) set.delete(action)
      else set.add(action)
      return { ...current, [resource]: set }
    })
  }

  function toggleResource(resource: PermissionResource) {
    const catalogActions = ROLE_PERMISSION_CATALOG[resource]
    setPermissionState((current) => {
      const selected = current[resource] ?? new Set<string>()
      const allSelected = catalogActions.every((action) => selected.has(action))
      if (allSelected) return { ...current, [resource]: new Set() }
      return { ...current, [resource]: new Set(catalogActions) }
    })
  }

  async function handleSubmit(values: RoleNameValues) {
    setPermissionsSubmitted(true)
    const permission = toPermissionPayload(permissionState)
    if (Object.keys(permission).length === 0) {
      toast.error("Enable at least one permission")
      return
    }
    setIsPending(true)
    const saved = await saveOrganizationRole({
      editingRole,
      roleName: values.role,
      permission,
    })
    setIsPending(false)
    if (!saved) return
    onSaved()
    onOpenChange(false)
  }

  return (
    <form
      noValidate
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <DialogHeader className="shrink-0 border-b p-4 pr-12">
        <DialogTitle>
          {isEditing ? "Edit custom role" : "Create custom role"}
        </DialogTitle>
        <DialogDescription>
          Name the role and choose what members with it can do. You can only
          grant permissions you already have.
        </DialogDescription>
      </DialogHeader>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <FieldGroup className="p-4">
          <Field
            data-invalid={nameError ? true : undefined}
            data-disabled={isPending ? true : undefined}
          >
            <FieldLabel htmlFor="role-name">Role name</FieldLabel>
            <Input
              autoFocus
              autoComplete="off"
              disabled={isPending}
              id="role-name"
              placeholder="support"
              aria-invalid={Boolean(nameError)}
              {...form.register("role")}
            />
            <FieldDescription>
              {normalizedDraft.length >= 2 && !nameError
                ? `Saved as ${normalizedDraft}`
                : "Letters, numbers, hyphens, and underscores. Saved in lowercase."}
            </FieldDescription>
            <FieldError errors={[nameError]} />
          </Field>

          <FieldSet data-invalid={showPermissionsError ? true : undefined}>
            <div className="flex items-center justify-between gap-3">
              <FieldLegend variant="label">Permissions</FieldLegend>
              <Badge variant={permissionsEmpty ? "outline" : "secondary"}>
                {selectedCount} selected
              </Badge>
            </div>
            <FieldDescription>
              Enable at least one action. Members with this role receive only
              these permissions.
            </FieldDescription>
            <RolePermissionPicker
              disabled={isPending}
              permissionState={permissionState}
              onToggleAction={toggleAction}
              onToggleResource={toggleResource}
            />
            {showPermissionsError ? (
              <FieldError>
                Enable at least one permission to continue.
              </FieldError>
            ) : null}
          </FieldSet>
        </FieldGroup>
      </div>

      <DialogFooter className="mx-0 mb-0 shrink-0">
        <DialogClose
          disabled={isPending}
          render={<Button type="button" variant="outline" />}
        >
          Cancel
        </DialogClose>
        <Button disabled={isPending || permissionsEmpty} type="submit">
          {isPending ? <Spinner data-icon="inline-start" /> : null}
          {isEditing ? "Save changes" : "Create role"}
        </Button>
      </DialogFooter>
    </form>
  )
}
