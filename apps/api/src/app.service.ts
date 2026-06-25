import { Injectable } from "@nestjs/common"
import { env } from "@workspace/config"

@Injectable()
export class AppService {
  getRoot() {
    return {
      name: env.APP_NAME,
      status: "ok",
      docs: env.NODE_ENV !== "production" ? "/docs" : undefined,
      auth: "/api/auth",
      health: "/v1/health",
    }
  }
}
