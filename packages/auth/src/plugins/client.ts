import { adminClient } from "better-auth/client/plugins"
import { ac, admin, user } from "../authorization"

export const authClientPlugins = [
  adminClient({ ac, roles: { admin, user } }),
]
