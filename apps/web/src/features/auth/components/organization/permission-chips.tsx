import { Badge } from "@workspace/ui-shadcn/components/badge"
import {
  PERMISSION_RESOURCE_LABELS,
  formatActionLabel,
  isPermissionResource,
} from "@/features/organization/lib/organization-roles"

export function PermissionChips({
  permission,
}: {
  readonly permission: Record<string, string[]>
}) {
  const entries = Object.entries(permission).flatMap(([resource, actions]) => {
    if (!isPermissionResource(resource) || actions.length === 0) return []
    return [{ resource, actions }] as const
  })
  if (entries.length === 0) {
    return <span className="text-xs text-muted-foreground">No permissions</span>
  }

  const visible = entries.slice(0, 3)
  const hiddenCount = entries.length - visible.length

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map(({ resource, actions }) => (
        <Badge key={resource} variant="secondary" className="font-normal">
          {PERMISSION_RESOURCE_LABELS[resource]} ·{" "}
          {actions.map(formatActionLabel).join(", ")}
        </Badge>
      ))}
      {hiddenCount > 0 ? (
        <Badge variant="outline" className="font-normal">
          +{hiddenCount} more
        </Badge>
      ) : null}
    </div>
  )
}
