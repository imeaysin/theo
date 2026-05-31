import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '@src/modules/user/queries/impl/get-user.query';
import { UserRepository } from '@src/modules/user/user.repository';
import type { IUserDocument } from '@repo/db';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(query: GetUserQuery): Promise<IUserDocument | null> {
    return this.userRepo.findById(query.id);
  }
}
