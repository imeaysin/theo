import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs"
import { DeviceTokenRepository } from "../../repositories/device-token.repository"
import { UnregisterDeviceTokenCommand } from "./unregister-device-token.command"

@CommandHandler(UnregisterDeviceTokenCommand)
export class UnregisterDeviceTokenHandler implements ICommandHandler<UnregisterDeviceTokenCommand> {
  constructor(private readonly deviceTokens: DeviceTokenRepository) {}

  async execute(command: UnregisterDeviceTokenCommand): Promise<void> {
    await this.deviceTokens.removeByUserAndToken(command.userId, command.token)
  }
}
