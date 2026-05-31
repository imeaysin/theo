import { Injectable } from '@nestjs/common';
import { UserModel, type IUser, type IUserDocument } from '@repo/db';

@Injectable()
export class UserRepository {
  async findAll(): Promise<IUserDocument[]> {
    return UserModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id).exec();
  }

  async update(
    id: string,
    data: Partial<
      Pick<IUser, 'name' | 'image' | 'role' | 'banned' | 'banReason'>
    >,
  ): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    ).exec();
  }
}
