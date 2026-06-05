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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PermissionGuard } from '@src/guards/permission.guard';
import { RequirePermission } from '@src/decorators/require-permission.decorator';
import { Roles } from '@src/decorators/roles.decorator';
import { CurrentUser } from '@src/decorators/current-user.decorator';
import { ApiResponses } from '@src/decorators/api-responses.decorator';
import { GetUsersQuery } from './queries/impl/get-users.query';
import { GetUserQuery } from './queries/impl/get-user.query';
import { UpdateUserRoleCommand } from './commands/impl/update-user-role.command';
import { BanUserCommand } from './commands/impl/ban-user.command';
import { UpdateMeCommand } from './commands/impl/update-me.command';
import {
  BanUserDto,
  UpdateProfileDto,
  UpdateUserRoleDto,
  UserResponseDto,
} from './dto/user.dto';
import type { SessionUser } from '@repo/auth/server';
import type { IUserDocument } from '@repo/db';

@ApiTags('Users')
@ApiBearerAuth()
@ApiResponses()
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user',
    type: UserResponseDto,
  })
  async getMe(@CurrentUser() user: SessionUser): Promise<IUserDocument> {
    const doc = await this.queryBus.execute<GetUserQuery, IUserDocument | null>(
      new GetUserQuery(user.id),
    );
    if (!doc) throw new NotFoundException('User not found');
    return doc;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Updated user',
    type: UserResponseDto,
  })
  async updateMe(
    @CurrentUser() user: SessionUser,
    @Body() body: UpdateProfileDto,
  ): Promise<IUserDocument | null> {
    return this.commandBus.execute<UpdateMeCommand, IUserDocument | null>(
      new UpdateMeCommand(user.id, body),
    );
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'List all users (admin)' })
  @ApiResponse({
    status: 200,
    description: 'User list',
    type: UserResponseDto,
    isArray: true,
  })
  async findAll(): Promise<IUserDocument[]> {
    return this.queryBus.execute<GetUsersQuery, IUserDocument[]>(
      new GetUsersQuery(),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiResponse({ status: 200, description: 'User', type: UserResponseDto })
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
  @ApiOperation({ summary: 'Update user role (admin)' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiResponse({
    status: 200,
    description: 'Updated user',
    type: UserResponseDto,
  })
  async updateRole(
    @Param('id') id: string,
    @Body() body: UpdateUserRoleDto,
  ): Promise<IUserDocument | null> {
    return this.commandBus.execute<UpdateUserRoleCommand, IUserDocument | null>(
      new UpdateUserRoleCommand(id, body.role),
    );
  }

  @Patch(':id/ban')
  @Roles('admin')
  @RequirePermission('user', 'update')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Ban user (admin)' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiResponse({
    status: 200,
    description: 'Updated user',
    type: UserResponseDto,
  })
  async banUser(
    @Param('id') id: string,
    @Body() body: BanUserDto,
  ): Promise<IUserDocument | null> {
    return this.commandBus.execute<BanUserCommand, IUserDocument | null>(
      new BanUserCommand(id, body.reason),
    );
  }
}
