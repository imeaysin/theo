import { Badge } from "@workspace/ui-shadcn/components/badge"
import { Card, CardContent } from "@workspace/ui-shadcn/components/card"
import { Separator } from "@workspace/ui-shadcn/components/separator"
import {
  BUILT_IN_ROLE_DESCRIPTIONS,
  STATIC_ORG_ROLES,
  formatRoleLabel,
  isAssignableBuiltInRole,
} from "@/features/organization/lib/organization-roles"
import { SectionHeader } from "@/components/page-header"

export function BuiltInRolesSection() {
  return (
    <div className="flex flex-col gap-3">
      <SectionHeader
        description="Defined in code for every organization. Owner cannot be assigned via invite."
        title="Built-in roles"
      />

      <Card className="gap-0 py-0">
        <CardContent className="p-0">
          {STATIC_ORG_ROLES.map((role, index) => (
            <div key={role}>
              {index > 0 ? <Separator /> : null}
              <div className="flex flex-col gap-1 px-4 py-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {formatRoleLabel(role)}
                  {!isAssignableBuiltInRole(role) ? (
                    <Badge variant="secondary">System</Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {BUILT_IN_ROLE_DESCRIPTIONS[role]}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
