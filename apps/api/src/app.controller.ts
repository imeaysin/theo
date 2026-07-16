import { Controller, Get, VERSION_NEUTRAL } from "@nestjs/common"
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { AllowAnonymous } from "./common/decorators"
import { ApiPublicErrorResponses } from "./common/decorators/api-error-responses.decorator"
import { AppService } from "./app.service"
import { ApiRootApiResponseDto } from "./app.dto"

@ApiTags("root")
@ApiPublicErrorResponses()
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: "API metadata",
    description: "Entry point with links to auth, health, and Swagger docs.",
  })
  @ApiOkResponse({ type: ApiRootApiResponseDto })
  getRoot() {
    return this.appService.getRoot()
  }
}
