import { Controller, Get } from "@nestjs/common"
import { QueryBus } from "@nestjs/cqrs"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { CurrentUser } from "../../common/decorators"
import type { JWTClaims } from "@workspace/auth/types"
import { GetMeQuery } from "./queries/get-me.query"

@ApiTags("account")
@Controller({ path: "me", version: "1" })
export class MeController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiBearerAuth("bearer")
  @ApiOperation({ summary: "Current user from JWT bearer token" })
  getMe(@CurrentUser() user: JWTClaims) {
    return this.queryBus.execute(new GetMeQuery(user))
  }
}
