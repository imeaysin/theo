import { createAuthPlugin } from "@better-auth-ui/core"
import {
  multiSessionPlugin as coreMultiSessionPlugin,
  type MultiSessionPluginOptions,
} from "@better-auth-ui/core/plugins"

import { ManageAccounts } from "@workspace/ui-shadcn/components/auth/multi-session/manage-accounts"
import { SwitchAccountSubmenu } from "@workspace/ui-shadcn/components/auth/multi-session/switch-account-submenu"

export const multiSessionPlugin = createAuthPlugin(
  coreMultiSessionPlugin.id,
  (options: MultiSessionPluginOptions = {}) => ({
    ...coreMultiSessionPlugin(options),
    accountCards: [ManageAccounts],
    userMenuItems: [SwitchAccountSubmenu],
  })
)
