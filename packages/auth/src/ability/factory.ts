import { AbilityBuilder, createMongoAbility } from "@casl/ability"
import { Roles } from "../access"
import type {
  AbilityUser,
  AppAbility,
  AppSubjectType,
  AppSubjects,
} from "./types"

function splitRoles(value: string | undefined): string[] {
  if (!value) return []
  return value
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean)
}

function collectRoles(user: AbilityUser): string[] {
  const globalRoles = splitRoles(user.role)
  const orgRoles = splitRoles(user.organizationRole)
  return [...new Set([...globalRoles, ...orgRoles])]
}

function grantOwnerAccess(can: AbilityBuilder<AppAbility>["can"]) {
  can("manage", "all")
}

function grantAdminAccess(can: AbilityBuilder<AppAbility>["can"]) {
  can(["create", "read", "update", "delete"], "Project")
  can(["create", "read", "update", "delete"], "Report")
  can(["create", "read", "update"], "Member")
  can(["create", "read", "update", "approve"], "Invoice")
  can(["read", "update"], "Settings")
}

function grantMemberAccess(
  can: AbilityBuilder<AppAbility>["can"],
  userId: string
) {
  can(["create", "read"], "Project")
  can(["create", "read"], "Report")
  can("read", "Member")
  can("read", "Invoice")
  can("update", "Project", { ownerId: userId })
  can("delete", "Project", { ownerId: userId })
}

function grantViewerAccess(can: AbilityBuilder<AppAbility>["can"]) {
  can("read", ["Project", "Report", "Member", "Invoice", "Settings"])
}

type RoleGrantConfig = {
  readonly can: AbilityBuilder<AppAbility>["can"]
  readonly roles: readonly string[]
  readonly user: AbilityUser
}

function applyRoleGrants(config: RoleGrantConfig) {
  const { can, roles, user } = config
  const isPlatformAdmin = roles.includes(Roles.admin) && !user.organizationId
  const isOrgAdmin = roles.includes(Roles.admin) && Boolean(user.organizationId)

  if (isPlatformAdmin || roles.includes(Roles.owner)) grantOwnerAccess(can)
  if (isOrgAdmin) grantAdminAccess(can)
  if (roles.includes(Roles.member)) grantMemberAccess(can, user.id)
  if (roles.includes(Roles.viewer)) grantViewerAccess(can)
  can(["read", "update"], "Member", { userId: user.id })
}

function detectSubjectType(item: AppSubjects): AppSubjectType {
  if (typeof item === "string") return item
  if (item.__typename) return item.__typename
  return "all"
}

export function defineAbilityFor(user: AbilityUser): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)
  applyRoleGrants({ can, roles: collectRoles(user), user })
  return build({ detectSubjectType })
}

export type { AppSubjects }
