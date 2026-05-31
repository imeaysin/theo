import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUserCommand } from '../impl/ban-user.command';
import { UserRepository } from '@/modules/user/user.repository';
import type { IUserDocument } from '@repo/db';

@CommandHandler(BanUserCommand)
export class BanUserHandler implements ICommandHandler<BanUserCommand> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: BanUserCommand): Promise<IUserDocument | null> {
    return this.userRepo.update(command.userId, {
      banned: true,
      banReason: command.reason,
    });
  }
}
