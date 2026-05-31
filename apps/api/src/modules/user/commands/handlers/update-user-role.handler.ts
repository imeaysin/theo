import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserRoleCommand } from '@src/modules/user/commands/impl/update-user-role.command';
import { UserRepository } from '@src/modules/user/user.repository';
import type { IUserDocument } from '@repo/db';

@CommandHandler(UpdateUserRoleCommand)
export class UpdateUserRoleHandler implements ICommandHandler<UpdateUserRoleCommand> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: UpdateUserRoleCommand): Promise<IUserDocument | null> {
    return this.userRepo.updateRole(command.userId, command.role);
  }
}
