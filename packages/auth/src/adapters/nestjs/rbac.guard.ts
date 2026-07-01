import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import {
  checkPlatformPermission,
  type PlatformRequiredPermission,
} from "../../permissions/platform"
import { PERMISSION_KEY } from "./require-permission.decorator"
import type { JwtClaims } from "../../types/auth"

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required =
      this.reflector.getAllAndOverride<PlatformRequiredPermission>(
        PERMISSION_KEY,
        [ctx.getHandler(), ctx.getClass()]
      )
    if (!required) return true

    const user = ctx.switchToHttp().getRequest<{ user: JwtClaims }>().user

    if (
      !checkPlatformPermission(user.role, required.resource, required.action)
    ) {
      throw new ForbiddenException("Insufficient permissions")
    }

    return true
  }
}
