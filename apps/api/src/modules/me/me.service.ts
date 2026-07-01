import { Injectable } from "@nestjs/common"
import type { JwtClaims } from "@workspace/auth/types"
import { MeResponseSchema, type MeResponse } from "@workspace/contracts"

@Injectable()
export class MeService {
  getCurrentUser(claims: JwtClaims): MeResponse {
    return MeResponseSchema.parse({
      id: claims.id,
      email: claims.email,
      role: claims.role,
      name: claims.name,
      activeOrganizationId: claims.activeOrganizationId,
      organizationRole: claims.organizationRole,
    })
  }
}
