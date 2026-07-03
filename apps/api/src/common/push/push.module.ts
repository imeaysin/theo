import {
  Global,
  Inject,
  Module,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common"
import { createPush, type PushProvider } from "@workspace/notifications"
import { pushEnv } from "@workspace/config/push"
import { createLogger } from "@workspace/logger"

export const PUSH_PROVIDER = Symbol("PUSH_PROVIDER")

function createPushProvider(): PushProvider {
  if (pushEnv.PUSH_PROVIDER === "expo") {
    return createPush({
      provider: "expo",
      accessToken: pushEnv.EXPO_ACCESS_TOKEN || undefined,
    })
  }

  return createPush({ provider: "console" })
}

@Global()
@Module({
  providers: [{ provide: PUSH_PROVIDER, useFactory: createPushProvider }],
  exports: [PUSH_PROVIDER],
})
export class PushModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(PUSH_PROVIDER) private readonly push: PushProvider) {}

  onModuleInit() {
    createLogger("Push").info({ provider: pushEnv.PUSH_PROVIDER }, "push ready")
  }

  onModuleDestroy() {
    void this.push.close()
  }
}
