import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMeCommand } from '@src/modules/user/commands/impl/update-me.command';
import { UserRepository } from '@src/modules/user/user.repository';
import type { IUserDocument } from '@repo/db';

@CommandHandler(UpdateMeCommand)
export class UpdateMeHandler implements ICommandHandler<UpdateMeCommand> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: UpdateMeCommand): Promise<IUserDocument | null> {
    return this.userRepo.updateProfile(command.userId, command.data);
  }
}
