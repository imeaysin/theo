import { Controller, Get, Req } from "@nestjs/common"
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import type { Request } from "express"
import { Session, type UserSession } from "@/common/decorators"
import { ApiAuthErrorResponses } from "@/common/decorators/api-error-responses.decorator"
import { UsersService } from "./users.service"
import { MeApiResponseDto } from "./dto"

@ApiTags("users")
@ApiAuthErrorResponses()
@Controller({ path: "users", version: "1" })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "Current user context" })
  @ApiOkResponse({ type: MeApiResponseDto })
  getMe(@Session() session: UserSession, @Req() request: Request) {
    return this.usersService.getCurrentUserContext({
      session,
      headers: toWebHeaders(request),
    })
  }
}

function toWebHeaders(request: Request): Headers {
  const headers = new Headers()
  for (const [key, value] of Object.entries(request.headers)) {
    if (typeof value === "string") {
      headers.set(key, value)
      continue
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item)
      }
    }
  }
  return headers
}
