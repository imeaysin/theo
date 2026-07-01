import { Controller, Get } from "@nestjs/common"
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Public } from "../../common/decorators"
import { ApiPublicErrorResponses } from "../../common/decorators/api-error-responses.decorator"
import { HealthApiResponseDto } from "./health.dto"
import { HealthService } from "./health.service"

@ApiTags("health")
@ApiPublicErrorResponses()
@Controller({ path: "health", version: "1" })
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: "Health check",
    description: "Liveness probe and MongoDB connectivity status.",
  })
  @ApiOkResponse({ type: HealthApiResponseDto })
  check() {
    return this.healthService.check()
  }
}
