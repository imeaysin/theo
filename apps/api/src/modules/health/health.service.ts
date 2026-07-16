import { Injectable } from "@nestjs/common"
import { env } from "@workspace/config"
import { HealthResponseSchema, type HealthResponse } from "@workspace/contracts"
import { isDbConnected } from "@workspace/db"

@Injectable()
export class HealthService {
  check(): HealthResponse {
    const dbUp = isDbConnected()

    return HealthResponseSchema.parse({
      status: dbUp ? "ok" : "degraded",
      app: env.APP_NAME,
      db: dbUp ? "up" : "down",
      timestamp: new Date().toISOString(),
    })
  }
}
