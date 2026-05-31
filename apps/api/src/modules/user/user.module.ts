import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { GetUsersHandler } from './queries/handlers/get-users.handler';
import { GetUserHandler } from './queries/handlers/get-user.handler';
import { UpdateUserRoleHandler } from './commands/handlers/update-user-role.handler';
import { BanUserHandler } from './commands/handlers/ban-user.handler';
import { UpdateMeHandler } from './commands/handlers/update-me.handler';

const CommandHandlers = [
  UpdateUserRoleHandler,
  BanUserHandler,
  UpdateMeHandler,
];
const QueryHandlers = [GetUsersHandler, GetUserHandler];

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [UserRepository, ...CommandHandlers, ...QueryHandlers],
})
export class UserModule {}
