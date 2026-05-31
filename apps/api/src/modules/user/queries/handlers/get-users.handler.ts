import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '../impl/get-users.query';
import { UserRepository } from '@/modules/user/user.repository';
import type { IUserDocument } from '@repo/db';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(): Promise<IUserDocument[]> {
    return this.userRepo.findAll();
  }
}
