import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import type { JWTClaims } from "../../types/auth.types"
import { ROLES_KEY } from "./roles.decorator"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<JWTClaims["role"][]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()]
    )
    if (!required?.length) return true

    const user = ctx.switchToHttp().getRequest<{ user: JWTClaims }>().user
    if (!required.includes(user.role)) {
      throw new ForbiddenException("Insufficient role")
    }

    return true
  }
}
