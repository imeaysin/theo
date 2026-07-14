import { Injectable } from "@nestjs/common"
import { findOrganizationMemberRole } from "@workspace/auth/nestjs"
import type { JwtClaims } from "@workspace/auth/types"
import { MeResponseSchema, type MeResponse } from "@workspace/contracts"

@Injectable()
export class UsersService {
  async getCurrentUserContext(claims: JwtClaims): Promise<MeResponse> {
    const orgRole = claims.activeOrganizationId
      ? await findOrganizationMemberRole(claims.activeOrganizationId, claims.id)
      : null

    return MeResponseSchema.parse({
      id: claims.id,
      email: claims.email,
      role: claims.role,
      name: claims.name,
      activeOrganizationId: claims.activeOrganizationId ?? null,
      organizationRole: orgRole,
    })
  }
}
