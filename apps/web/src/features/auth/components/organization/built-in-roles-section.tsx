import { Badge } from "@workspace/ui-shadcn/components/badge"
import { Card } from "@workspace/ui-shadcn/components/card"
import {
  BUILT_IN_ROLE_DESCRIPTIONS,
  STATIC_ORG_ROLES,
  formatRoleLabel,
  isAssignableBuiltInRole,
} from "@/features/organization/lib/organization-roles"

export function BuiltInRolesSection() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">Built-in roles</h3>
        <p className="text-xs text-muted-foreground">
          Defined in code for every organization. Owner cannot be assigned via
          invite.
        </p>
      </div>

      <Card className="overflow-hidden p-0">
        <ul className="divide-y divide-border">
          {STATIC_ORG_ROLES.map((role) => (
            <li
              key={role}
              className="flex items-start justify-between gap-4 px-4 py-3"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatRoleLabel(role)}
                  </span>
                  {!isAssignableBuiltInRole(role) ? (
                    <Badge variant="secondary">System</Badge>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  {BUILT_IN_ROLE_DESCRIPTIONS[role]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
