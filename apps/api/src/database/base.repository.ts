import {
  Document,
  type Model,
  type QueryFilter,
  type UpdateQuery,
} from 'mongoose';

/**
 * Generic base repository for Mongoose models.
 * Extend this class in domain repositories to get common CRUD operations.
 *
 * @template T - The Mongoose Document type (e.g. IUserDocument)
 */
export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findAll(filter: QueryFilter<T> = {}): Promise<T[]> {
    return this.model.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    return doc.save() as Promise<T>;
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async exists(filter: QueryFilter<T>): Promise<boolean> {
    const count = await this.model.countDocuments(filter).exec();
    return count > 0;
  }
}
