import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { checkPlatformPermission } from "../../permissions/check-platform-permission"
import { PERMISSION_KEY } from "./require-permission.decorator"
import type { JWTClaims } from "../../types/auth.types"

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<{
      resource: string
      action: string
    }>(PERMISSION_KEY, [ctx.getHandler(), ctx.getClass()])
    if (!required) return true

    const user = ctx.switchToHttp().getRequest<{ user: JWTClaims }>().user

    if (
      !checkPlatformPermission(user.role, required.resource, required.action)
    ) {
      throw new ForbiddenException("Insufficient permissions")
    }

    return true
  }
}
