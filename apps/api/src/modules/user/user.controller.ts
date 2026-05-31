import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PermissionGuard } from '@/guards/permission.guard';
import { RequirePermission } from '@/decorators/require-permission.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { GetUsersQuery } from './queries/impl/get-users.query';
import { GetUserQuery } from './queries/impl/get-user.query';
import { UpdateUserRoleCommand } from './commands/impl/update-user-role.command';
import { BanUserCommand } from './commands/impl/ban-user.command';
import { UpdateMeCommand } from './commands/impl/update-me.command';
import { parseBody } from '@/utils/parse-body';
import {
  BanUserSchema,
  UpdateUserRoleSchema,
  UpdateProfileSchema,
} from '@repo/contracts';
import type { SessionUser } from '@repo/auth';
import type { IUserDocument } from '@repo/db';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('me')
  async getMe(@CurrentUser() user: SessionUser): Promise<IUserDocument> {
    const doc = await this.queryBus.execute<GetUserQuery, IUserDocument | null>(
      new GetUserQuery(user.id),
    );
    if (!doc) throw new NotFoundException('User not found');
    return doc;
  }

  @Patch('me')
  async updateMe(
    @CurrentUser() user: SessionUser,
    @Body() body: unknown,
  ): Promise<IUserDocument | null> {
    const data = parseBody(UpdateProfileSchema, body);
    return this.commandBus.execute<UpdateMeCommand, IUserDocument | null>(
      new UpdateMeCommand(user.id, data),
    );
  }

  @Get()
  @Roles('admin')
  async findAll(): Promise<IUserDocument[]> {
    return this.queryBus.execute<GetUsersQuery, IUserDocument[]>(
      new GetUsersQuery(),
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: SessionUser,
  ): Promise<IUserDocument> {
    if (user.role !== 'admin' && user.id !== id) {
      throw new ForbiddenException('Access denied');
    }

    const targetUser = await this.queryBus.execute<
      GetUserQuery,
      IUserDocument | null
    >(new GetUserQuery(id));

    if (!targetUser) throw new NotFoundException('User not found');
    return targetUser;
  }

  @Patch(':id/role')
  @Roles('admin')
  @RequirePermission('user', 'update')
  @UseGuards(PermissionGuard)
  async updateRole(
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<IUserDocument | null> {
    const { role } = parseBody(UpdateUserRoleSchema, body);
    return this.commandBus.execute<UpdateUserRoleCommand, IUserDocument | null>(
      new UpdateUserRoleCommand(id, role),
    );
  }

  @Patch(':id/ban')
  @Roles('admin')
  @RequirePermission('user', 'update')
  @UseGuards(PermissionGuard)
  async banUser(
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<IUserDocument | null> {
    const { reason } = parseBody(BanUserSchema, body);
    return this.commandBus.execute<BanUserCommand, IUserDocument | null>(
      new BanUserCommand(id, reason),
    );
  }
}
