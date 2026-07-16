import { Badge } from "@/components/ui/badge"
import {
  ASSIGNABLE_ORG_ROLES,
  STATIC_ORG_ROLES,
  formatRoleLabel,
} from "@/features/organization/lib/organization-roles"

export function BuiltInRolesSection() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">Built-in roles</p>
      <div className="flex flex-wrap gap-2">
        {STATIC_ORG_ROLES.map((role) => (
          <Badge key={role} variant="secondary">
            {formatRoleLabel(role)}
            {ASSIGNABLE_ORG_ROLES.some((assignable) => assignable === role)
              ? ""
              : " (system)"}
          </Badge>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Built-in roles are defined in code. Custom roles below are stored per
        organization.
      </p>
    </div>
  )
}
