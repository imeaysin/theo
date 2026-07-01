import type { GenericEndpointContext, Session } from "better-auth"
import { getOrgAdapter } from "better-auth/plugins/organization"
import { organizationPluginOptions } from "../config/organization-plugin"

export function sanitizeOrganizationSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function buildOrganizationSlug(name: string, userId: string) {
  const base = sanitizeOrganizationSlug(name) || "workspace"
  return `${base}-${userId.slice(0, 8)}`
}

function getOrganizationAdapter(context: GenericEndpointContext) {
  return getOrgAdapter(context.context, organizationPluginOptions)
}

async function getFirstOrganizationId(
  context: GenericEndpointContext,
  userId: string
) {
  const adapter = getOrganizationAdapter(context)
  const organizations = await adapter.listOrganizations(userId)
  return organizations[0]?.id ?? null
}

export async function ensureSessionActiveOrganization(
  context: GenericEndpointContext | null,
  session: Session & Record<string, unknown>
): Promise<{ data: Session & Record<string, unknown> }> {
  if (session.activeOrganizationId) {
    return { data: session }
  }

  if (!context) {
    return { data: session }
  }

  const user = await context.context.internalAdapter.findUserById(
    session.userId
  )

  if (!user) {
    return { data: session }
  }

  const organizationId = await getFirstOrganizationId(context, user.id)

  if (!organizationId) {
    return { data: session }
  }

  return {
    data: {
      ...session,
      activeOrganizationId: organizationId,
    },
  }
}
