import { createZodDto } from 'nestjs-zod';
import {
  BanUserSchema,
  UpdateProfileSchema,
  UpdateUserRoleSchema,
  UserResponseSchema,
} from '@repo/contracts';

export class UserResponseDto extends createZodDto(UserResponseSchema) {}

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}

export class UpdateUserRoleDto extends createZodDto(UpdateUserRoleSchema) {}

export class BanUserDto extends createZodDto(BanUserSchema) {}
