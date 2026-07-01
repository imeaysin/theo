import { Controller, Get } from "@nestjs/common"
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger"
import type { JwtClaims } from "@workspace/auth/types"
import { CurrentUser } from "../../common/decorators"
import { ApiAuthErrorResponses } from "../../common/decorators/api-error-responses.decorator"
import { MeApiResponseDto } from "./me.dto"
import { MeService } from "./me.service"

@ApiTags("account")
@ApiAuthErrorResponses()
@Controller({ path: "me", version: "1" })
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Current user",
    description: "Returns JWT claims for the bearer token.",
  })
  @ApiOkResponse({ type: MeApiResponseDto })
  getMe(@CurrentUser() user: JwtClaims) {
    return this.meService.getCurrentUser(user)
  }
}
