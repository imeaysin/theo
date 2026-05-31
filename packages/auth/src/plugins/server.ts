import { admin as adminPlugin, openAPI, twoFactor } from "better-auth/plugins"
import { ac, admin, user } from "../permissions"

export const authServerPlugins = [
  adminPlugin({ ac, roles: { admin, user } }),
  twoFactor(),
  openAPI(),
]
