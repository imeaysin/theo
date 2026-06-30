import { Controller, Get } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { Public } from "../../common/decorators"
import { isDbConnected } from "@workspace/db"
import { env } from "@workspace/config"

@ApiTags("health")
@Controller({ path: "health", version: "1" })
export class HealthController {
  @Get()
  @Public()
  @ApiOperation({ summary: "Liveness and database connectivity check" })
  check() {
    const dbUp = isDbConnected()

    return {
      status: dbUp ? "ok" : "degraded",
      app: env.APP_NAME,
      db: dbUp ? "up" : "down",
      timestamp: new Date().toISOString(),
    }
  }
}
