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
import { MeApiResponseDto } from "./dto"
import { UsersService } from "./users.service"

@ApiTags("users")
@ApiAuthErrorResponses()
@Controller({ path: "users", version: "1" })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiBearerAuth("bearer")
  @ApiOperation({
    summary: "Current user",
    description: "Returns JWT claims for the bearer token.",
  })
  @ApiOkResponse({ type: MeApiResponseDto })
  async getMe(@CurrentUser() user: JwtClaims) {
    return this.usersService.getCurrentUserContext(user)
  }
}
