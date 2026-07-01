import type { InferAdminRolesFromOption } from "better-auth/plugins/admin"
import { ac, platformRoles } from "../permissions/platform"

export const adminPluginOptions = {
  ac,
  roles: platformRoles,
} as const

export type PlatformRoleName = InferAdminRolesFromOption<
  typeof adminPluginOptions
>
