import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs"
import { Expo } from "@workspace/notifications"
import { DomainErrorCode } from "@workspace/contracts"
import { apiBadRequest } from "../../../../common/exceptions/api.exception"
import { DeviceTokenRepository } from "../../repositories/device-token.repository"
import { RegisterDeviceTokenCommand } from "./register-device-token.command"

@CommandHandler(RegisterDeviceTokenCommand)
export class RegisterDeviceTokenHandler implements ICommandHandler<RegisterDeviceTokenCommand> {
  constructor(private readonly deviceTokens: DeviceTokenRepository) {}

  async execute(command: RegisterDeviceTokenCommand): Promise<void> {
    if (!Expo.isExpoPushToken(command.input.token)) {
      apiBadRequest(
        "Invalid Expo push token format",
        DomainErrorCode.INVALID_PUSH_TOKEN
      )
    }

    await this.deviceTokens.upsert(command.entity)
  }
}
