import "@/lib/auth/auth-plugin"
import { createAuthPlugin } from "@better-auth-ui/core"
import {
  magicLinkPlugin as coreMagicLinkPlugin,
  type MagicLinkPluginOptions,
} from "@better-auth-ui/core/plugins"

import { MagicLink } from "@/features/auth/components/magic-link"
import { MagicLinkButton } from "@/features/auth/components/magic-link-button"

export const magicLinkPlugin = createAuthPlugin(
  coreMagicLinkPlugin.id,
  (options: MagicLinkPluginOptions = {}) => ({
    ...coreMagicLinkPlugin(options),
    authButtons: [MagicLinkButton],
    views: {
      auth: { magicLink: MagicLink },
    },
    fallbackViews: {
      auth: { signIn: MagicLink },
    },
  })
)
