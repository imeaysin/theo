import { Button } from "@workspace/ui-shadcn/components/button"
import { Checkbox } from "@workspace/ui-shadcn/components/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui-shadcn/components/field"
import { Separator } from "@workspace/ui-shadcn/components/separator"
import type { PermissionState } from "@/features/organization/lib/permission-state"
import {
  PERMISSION_RESOURCE_LABELS,
  ROLE_PERMISSION_CATALOG,
  formatActionLabel,
  isPermissionResource,
  type PermissionResource,
} from "@/features/organization/lib/organization-roles"

type RolePermissionPickerProps = {
  readonly disabled?: boolean
  readonly permissionState: PermissionState
  readonly onToggleAction: (
    resource: PermissionResource,
    action: string
  ) => void
  readonly onToggleResource: (resource: PermissionResource) => void
}

function ResourcePermissionGroup({
  resource,
  actions,
  disabled,
  selected,
  onToggleAction,
  onToggleResource,
}: {
  readonly resource: PermissionResource
  readonly actions: readonly string[]
  readonly disabled?: boolean
  readonly selected: ReadonlySet<string>
  readonly onToggleAction: (
    resource: PermissionResource,
    action: string
  ) => void
  readonly onToggleResource: (resource: PermissionResource) => void
}) {
  const allSelected = actions.every((action) => selected.has(action))
  const selectedInGroup = actions.filter((action) =>
    selected.has(action)
  ).length

  return (
    <FieldSet data-disabled={disabled ? true : undefined}>
      <div className="flex items-center justify-between gap-3">
        <FieldLegend variant="label">
          {PERMISSION_RESOURCE_LABELS[resource]}
        </FieldLegend>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={disabled}
          onClick={() => onToggleResource(resource)}
        >
          {allSelected ? "Clear" : "Select all"}
        </Button>
      </div>
      <FieldDescription>
        {selectedInGroup} of {actions.length} selected
      </FieldDescription>
      <FieldGroup className="gap-3">
        {actions.map((action) => {
          const id = `role-permission-${resource}-${action}`
          return (
            <Field
              key={id}
              orientation="horizontal"
              data-disabled={disabled ? true : undefined}
            >
              <Checkbox
                id={id}
                checked={selected.has(action)}
                disabled={disabled}
                onCheckedChange={() => onToggleAction(resource, action)}
              />
              <FieldLabel htmlFor={id}>{formatActionLabel(action)}</FieldLabel>
            </Field>
          )
        })}
      </FieldGroup>
    </FieldSet>
  )
}

export function RolePermissionPicker({
  disabled,
  permissionState,
  onToggleAction,
  onToggleResource,
}: RolePermissionPickerProps) {
  const resources = Object.entries(ROLE_PERMISSION_CATALOG).flatMap(
    ([resource, actions]) => {
      if (!isPermissionResource(resource)) return []
      return [{ resource, actions }] as const
    }
  )

  return (
    <FieldGroup className="gap-5">
      {resources.map(({ resource, actions }, index) => (
        <div key={resource} className="flex flex-col gap-5">
          {index > 0 ? <Separator /> : null}
          <ResourcePermissionGroup
            resource={resource}
            actions={actions}
            disabled={disabled}
            selected={permissionState[resource] ?? new Set()}
            onToggleAction={onToggleAction}
            onToggleResource={onToggleResource}
          />
        </div>
      ))}
    </FieldGroup>
  )
}
