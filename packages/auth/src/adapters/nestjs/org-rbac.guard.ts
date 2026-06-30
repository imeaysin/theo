import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { checkOrganizationPermissionAsync } from "../../permissions/check-organization-permission"
import type { JWTClaims } from "../../types/auth.types"
import { ORG_PERMISSION_KEY } from "./require-org-permission.decorator"

@Injectable()
export class OrgRbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<{
      resource: string
      action: string
    }>(ORG_PERMISSION_KEY, [ctx.getHandler(), ctx.getClass()])
    if (!required) return true

    const user = ctx.switchToHttp().getRequest<{ user: JWTClaims }>().user

    if (!user.activeOrganizationId) {
      throw new ForbiddenException("No active organization")
    }

    const allowed = await checkOrganizationPermissionAsync(
      user.activeOrganizationId,
      user.organizationRole,
      required.resource,
      required.action
    )
    if (!allowed) {
      throw new ForbiddenException("Insufficient organization permissions")
    }

    return true
  }
}
