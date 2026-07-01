import type { InferOrganizationRolesFromOption } from "better-auth/plugins/organization"
import { ac, organizationRoles } from "../permissions/organization"

export const organizationPluginOptions = {
  ac,
  roles: organizationRoles,
  dynamicAccessControl: {
    enabled: true,
  },
} as const

export type OrganizationRoleName = InferOrganizationRolesFromOption<
  typeof organizationPluginOptions
>
