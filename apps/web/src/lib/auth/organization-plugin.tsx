import "@/lib/auth/auth-plugin"
import { createAuthPlugin } from "@better-auth-ui/core"
import {
  organizationPlugin as coreOrganizationPlugin,
  type OrganizationLocalization,
  type OrganizationPluginOptions,
} from "@better-auth-ui/core/plugins"
import { Briefcase } from "lucide-react"

import { OrganizationsSettings } from "@/features/auth/components/auth/organization/organizations-settings"

declare module "@better-auth-ui/core/plugins" {
  interface OrganizationViewPaths {
    /** @default "roles" */
    roles?: string
  }
}

export const organizationPlugin = createAuthPlugin(
  coreOrganizationPlugin.id,
  (options: OrganizationPluginOptions = {}) => {
    const core = coreOrganizationPlugin(options)

    return {
      ...core,
      localization: core.localization as OrganizationLocalization,
      viewPaths: {
        ...core.viewPaths,
        organization: {
          ...core.viewPaths.organization,
          roles: options.viewPaths?.organization?.roles ?? "roles",
        },
      },
      settingsTabs: [
        {
          view: "organizations" as const,
          label: (
            <>
              <Briefcase className="text-muted-foreground" />
              {core.localization.organizations}
            </>
          ),
          component: OrganizationsSettings,
        },
      ],
    }
  }
)
