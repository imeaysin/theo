import type { RegisterDeviceTokenInput } from "@workspace/contracts"
import type { NewDeviceTokenEntity } from "../../entities/device-token.entity"

export class RegisterDeviceTokenCommand {
  constructor(
    public readonly userId: string,
    public readonly input: RegisterDeviceTokenInput
  ) {}

  get entity(): NewDeviceTokenEntity {
    return {
      userId: this.userId,
      token: this.input.token,
      platform: this.input.platform,
    }
  }
}
