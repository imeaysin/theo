import { Controller, Get } from "@nestjs/common"
import { QueryBus } from "@nestjs/cqrs"
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger"
import { CurrentUser } from "../../common/decorators"
import { ApiAuthErrorResponses } from "../../common/decorators/api-error-responses.decorator"
import type { JwtClaims } from "@workspace/auth/types"
import { MeApiResponseDto } from "./me.dto"
import { GetMeQuery } from "./queries/get-me.query"

@ApiTags("account")
@ApiAuthErrorResponses()
@Controller({ path: "me", version: "1" })
export class MeController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Current user",
    description: "Returns JWT claims for the bearer token.",
  })
  @ApiOkResponse({ type: MeApiResponseDto })
  getMe(@CurrentUser() user: JwtClaims) {
    return this.queryBus.execute(new GetMeQuery(user))
  }
}
