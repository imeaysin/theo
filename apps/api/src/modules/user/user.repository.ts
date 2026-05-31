import { Injectable } from '@nestjs/common';
import { UserModel, type IUser, type IUserDocument } from '@repo/db';
import { BaseRepository } from '@src/database/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<IUserDocument> {
  constructor() {
    super(UserModel);
  }

  /**
   * User-specific methods go below.
   * Common methods (findAll, findById, findOne, create, update, delete, exists)
   * are inherited from BaseRepository.
   */

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return this.findOne({ email });
  }

  async updateProfile(
    id: string,
    data: Partial<Pick<IUser, 'name' | 'image'>>,
  ): Promise<IUserDocument | null> {
    return this.update(id, data);
  }

  async updateRole(
    id: string,
    role: IUser['role'],
  ): Promise<IUserDocument | null> {
    return this.update(id, { role });
  }

  async ban(
    id: string,
    reason: string,
    banExpires?: Date,
  ): Promise<IUserDocument | null> {
    return this.update(id, { banned: true, banReason: reason, banExpires: banExpires ?? null });
  }

  async unban(id: string): Promise<IUserDocument | null> {
    return this.update(id, { banned: false, banReason: null, banExpires: null });
  }
}
