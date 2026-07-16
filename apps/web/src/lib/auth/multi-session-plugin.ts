import "@/lib/auth/auth-plugin"
import { createAuthPlugin } from "@better-auth-ui/core"
import {
  multiSessionPlugin as coreMultiSessionPlugin,
  type MultiSessionPluginOptions,
} from "@better-auth-ui/core/plugins"

import { ManageAccounts } from "@/features/auth/components/multi-session/manage-accounts"
import { SwitchAccountSubmenu } from "@/features/auth/components/multi-session/switch-account-submenu"

export const multiSessionPlugin = createAuthPlugin(
  coreMultiSessionPlugin.id,
  (options: MultiSessionPluginOptions = {}) => ({
    ...coreMultiSessionPlugin(options),
    accountCards: [ManageAccounts],
    userMenuItems: [SwitchAccountSubmenu],
  })
)
