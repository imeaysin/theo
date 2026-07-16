import { BadRequestException } from "@nestjs/common"
import type { UserSession } from "@workspace/auth/nestjs"

export function requireActiveOrganizationId(session: UserSession): string {
  const organizationId = session.session.activeOrganizationId
  if (!organizationId) {
    throw new BadRequestException("Active organization is required")
  }
  return organizationId
}
