import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import type { JwtClaims } from "../../types/auth"

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtClaims => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtClaims }>()
    return request.user
  }
)
