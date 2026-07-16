import "@/lib/auth/auth-plugin"
import { createAuthPlugin } from "@better-auth-ui/core"
import {
  type ApiKeyPluginOptions,
  apiKeyPlugin as coreApiKeyPlugin,
} from "@better-auth-ui/core/plugins"

import { ApiKeys } from "@/features/auth/components/api-key/api-keys"
import { OrganizationApiKeys } from "@/features/auth/components/api-key/organization-api-keys"

export const apiKeyPlugin = createAuthPlugin(
  coreApiKeyPlugin.id,
  (options: ApiKeyPluginOptions = {}) => {
    const core = coreApiKeyPlugin(options)

    return {
      ...core,
      securityCards: [ApiKeys],
      ...(core.organization
        ? { organizationCards: [OrganizationApiKeys] }
        : {}),
    }
  }
)
