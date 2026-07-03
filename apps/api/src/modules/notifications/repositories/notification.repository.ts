import { Inject, Injectable, type OnModuleInit } from "@nestjs/common"
import { ObjectId, type Db } from "mongodb"
import { MONGO_DB } from "../../../common/database/database.module"
import type {
  NewNotificationEntity,
  NotificationEntity,
} from "../entities/notification.entity"
import type {
  NotificationMutationScope,
  NotificationUserScope,
} from "../notification.scope"

const COLLECTION = "notifications"
const DEFAULT_LIMIT = 50

@Injectable()
export class NotificationRepository implements OnModuleInit {
  constructor(@Inject(MONGO_DB) private readonly db: Db) {}

  async onModuleInit() {
    const col = this.db.collection(COLLECTION)
    await col.createIndex({ userId: 1, createdAt: -1 })
    await col.createIndex({ userId: 1, read: 1 })
  }

  async insert(data: NewNotificationEntity): Promise<NotificationEntity> {
    const now = new Date()
    const doc = {
      userId: data.userId,
      title: data.title,
      body: data.body,
      type: data.type,
      read: false,
      actionUrl: data.actionUrl,
      createdAt: now,
    }

    const { insertedId } = await this.db
      .collection<Omit<NotificationEntity, "_id">>(COLLECTION)
      .insertOne(doc)

    return { _id: insertedId, ...doc }
  }

  /** Bulk insert for multi-user fan-out. */
  async insertMany(items: NewNotificationEntity[]): Promise<number> {
    if (items.length === 0) return 0

    const now = new Date()
    const docs = items.map((data) => ({
      userId: data.userId,
      title: data.title,
      body: data.body,
      type: data.type,
      read: false,
      actionUrl: data.actionUrl,
      createdAt: now,
    }))

    const result = await this.db
      .collection<Omit<NotificationEntity, "_id">>(COLLECTION)
      .insertMany(docs)

    return result.insertedCount
  }

  async findByUser(
    scope: NotificationUserScope,
    limit = DEFAULT_LIMIT
  ): Promise<NotificationEntity[]> {
    return this.db
      .collection<NotificationEntity>(COLLECTION)
      .find({ userId: scope.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
  }

  async countUnread(scope: NotificationUserScope): Promise<number> {
    return this.db
      .collection<NotificationEntity>(COLLECTION)
      .countDocuments({ userId: scope.userId, read: false })
  }

  async markAsRead(scope: NotificationMutationScope): Promise<boolean> {
    if (!ObjectId.isValid(scope.notificationId)) return false

    const result = await this.db
      .collection<NotificationEntity>(COLLECTION)
      .updateOne(
        { _id: new ObjectId(scope.notificationId), userId: scope.userId },
        { $set: { read: true } }
      )

    return result.modifiedCount > 0 || result.matchedCount > 0
  }

  async markAllAsRead(scope: NotificationUserScope): Promise<number> {
    const result = await this.db
      .collection<NotificationEntity>(COLLECTION)
      .updateMany(
        { userId: scope.userId, read: false },
        { $set: { read: true } }
      )

    return result.modifiedCount
  }

  async delete(scope: NotificationMutationScope): Promise<boolean> {
    if (!ObjectId.isValid(scope.notificationId)) return false

    const result = await this.db
      .collection<NotificationEntity>(COLLECTION)
      .deleteOne({
        _id: new ObjectId(scope.notificationId),
        userId: scope.userId,
      })

    return result.deletedCount > 0
  }
}
