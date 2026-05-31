import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUserCommand } from '@src/modules/user/commands/impl/ban-user.command';
import { UserRepository } from '@src/modules/user/user.repository';
import type { IUserDocument } from '@repo/db';

@CommandHandler(BanUserCommand)
export class BanUserHandler implements ICommandHandler<BanUserCommand> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: BanUserCommand): Promise<IUserDocument | null> {
    return this.userRepo.ban(command.userId, command.reason ?? '');
  }
}
