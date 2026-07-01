import { Injectable } from "@nestjs/common"
import { env } from "@workspace/config"
import { ApiRootResponseSchema } from "@workspace/contracts"

@Injectable()
export class AppService {
  getRoot() {
    return ApiRootResponseSchema.parse({
      name: env.APP_NAME,
      status: "ok",
      docs: env.NODE_ENV !== "production" ? "/docs" : undefined,
      auth: "/api/auth",
      health: "/v1/health",
    })
  }
}
