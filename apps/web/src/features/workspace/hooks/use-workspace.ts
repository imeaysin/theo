import { useQuery } from "@tanstack/react-query"
import { authClient } from "@workspace/auth/client"
import { z } from "zod"

const RoleRowSchema = z.object({
  id: z.string(),
  role: z.string(),
  organizationId: z.string(),
  permission: z.unknown(),
})

export type WorkspaceMember = {
  readonly id: string
  readonly role: string
  readonly userId: string
  readonly organizationId: string
  readonly createdAt: Date | string
  readonly user: {
    readonly id: string
    readonly name: string
    readonly email: string
    readonly image?: string | null
  }
}

export type WorkspaceInvitation = {
  readonly id: string
  readonly email: string
  readonly role: string
  readonly status: string
  readonly organizationId: string
  readonly expiresAt: Date | string
}

export type WorkspaceRole = {
  readonly id: string
  readonly role: string
  readonly permission: Record<string, string[]>
  readonly organizationId: string
}

function isPermissionMap(value: unknown): value is Record<string, string[]> {
  if (!value || typeof value !== "object") return false
  return Object.values(value).every(
    (actions) =>
      Array.isArray(actions) &&
      actions.every((action) => typeof action === "string")
  )
}

function toPermissionMap(value: unknown): Record<string, string[]> {
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value)
      return isPermissionMap(parsed) ? parsed : {}
    } catch {
      return {}
    }
  }
  return isPermissionMap(value) ? value : {}
}

export function useWorkspaceOrganization() {
  return authClient.useActiveOrganization()
}

export function useWorkspaceRoles(organizationId: string | null | undefined) {
  return useQuery({
    queryKey: ["workspace", "roles", organizationId],
    enabled: Boolean(organizationId),
    queryFn: async (): Promise<WorkspaceRole[]> => {
      const result = await authClient.organization.listRoles({
        query: { organizationId: organizationId ?? undefined },
      })
      if (result.error) {
        throw new Error(result.error.message ?? "Could not load roles")
      }
      const rows: unknown[] = Array.isArray(result.data) ? result.data : []
      return rows.flatMap((row) => {
        const parsed = RoleRowSchema.safeParse(row)
        if (!parsed.success) return []
        return [
          {
            id: parsed.data.id,
            role: parsed.data.role,
            organizationId: parsed.data.organizationId,
            permission: toPermissionMap(parsed.data.permission),
          },
        ]
      })
    },
  })
}

export function workspaceRolesKey(organizationId: string) {
  return ["workspace", "roles", organizationId] as const
}
