import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@workspace/ui-shadcn/components/field"
import { Switch } from "@workspace/ui-shadcn/components/switch"
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
  const resourceSwitchId = `role-permission-${resource}-all`

  return (
    <FieldSet data-disabled={disabled ? true : undefined}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <FieldLegend variant="label">
            {PERMISSION_RESOURCE_LABELS[resource]}
          </FieldLegend>
          <FieldDescription>
            {selectedInGroup} of {actions.length} enabled
          </FieldDescription>
        </div>
        <Switch
          id={resourceSwitchId}
          size="sm"
          checked={allSelected}
          disabled={disabled}
          aria-label={`Enable all ${PERMISSION_RESOURCE_LABELS[resource]} permissions`}
          onCheckedChange={() => onToggleResource(resource)}
        />
      </div>

      <FieldGroup className="gap-3">
        {actions.map((action) => {
          const id = `role-permission-${resource}-${action}`
          return (
            <Field
              key={id}
              orientation="horizontal"
              data-disabled={disabled ? true : undefined}
            >
              <FieldContent>
                <FieldLabel htmlFor={id}>
                  {formatActionLabel(action)}
                </FieldLabel>
              </FieldContent>
              <Switch
                id={id}
                size="sm"
                checked={selected.has(action)}
                disabled={disabled}
                onCheckedChange={() => onToggleAction(resource, action)}
              />
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
          {index > 0 ? <FieldSeparator /> : null}
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
