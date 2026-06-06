import { createAccessControl } from "better-auth/plugins/access"
import { statement, rolePermissions } from "@workspace/permission-manager"

const ac = createAccessControl(statement)

const admin = ac.newRole({
  user: rolePermissions.admin.user,
  session: rolePermissions.admin.session,
  profile: rolePermissions.admin.profile,
  subscription: rolePermissions.admin.subscription,
  analytics: rolePermissions.admin.analytics,
  settings: rolePermissions.admin.settings,
})

const user = ac.newRole(rolePermissions.user)

export { ac, admin, user }
