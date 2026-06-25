import { Controller, Get, Req } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import type { JWTClaims } from "@workspace/auth/types"

@ApiTags("account")
@Controller({ path: "me", version: "1" })
export class MeController {
  @Get()
  @ApiBearerAuth("bearer")
  @ApiOperation({ summary: "Current user from JWT bearer token" })
  getMe(@Req() req: { user: JWTClaims }) {
    return req.user
  }
}
