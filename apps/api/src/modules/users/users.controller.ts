import { Controller, Get } from "@nestjs/common"
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger"
import type { JwtClaims } from "@workspace/auth/types"
import { CurrentUser } from "@/common/decorators"
import { ApiAuthErrorResponses } from "@/common/decorators/api-error-responses.decorator"
import { UsersService } from "./users.service"
import { MeApiResponseDto } from "./dto"

@ApiTags("users")
@ApiAuthErrorResponses()
@ApiBearerAuth("bearer")
@Controller({ path: "users", version: "1" })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOperation({
    summary: "Current user context",
    description:
      "Returns fast JWT claims for the bearer token without querying the database.",
  })
  @ApiOkResponse({ type: MeApiResponseDto })
  async getMe(@CurrentUser() user: JwtClaims) {
    return this.usersService.getCurrentUserContext(user)
  }
}
