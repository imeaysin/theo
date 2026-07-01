import type { PlatformRoleName } from "./admin-plugin"

export interface JwtPayload {
  id: string
  email: string
  role: PlatformRoleName
  name: string
  activeOrganizationId: string | null
  organizationRole: string | null
}
