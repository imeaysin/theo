import "@/lib/auth/auth-plugin"
import { createAuthPlugin } from "@better-auth-ui/core"
import {
  deleteUserPlugin as coreDeleteUserPlugin,
  type DeleteUserPluginOptions,
} from "@better-auth-ui/core/plugins"

import { DangerZone } from "@/features/auth/components/delete-user/danger-zone"

export const deleteUserPlugin = createAuthPlugin(
  coreDeleteUserPlugin.id,
  (options: DeleteUserPluginOptions = {}) => ({
    ...coreDeleteUserPlugin(options),
    securityCards: [DangerZone],
  })
)
