import { Injectable, type OnModuleInit } from "@nestjs/common"
import { NotificationModel, DeviceTokenModel } from "@workspace/db"
import type {
  NotificationEntity,
  DeviceTokenEntity,
  NotificationUserScope,
} from "../domain/notification.model"

const DEFAULT_LIMIT = 50

@Injectable()
export class NotificationQueryRepository implements OnModuleInit {
  async onModuleInit() {
    await NotificationModel.syncIndexes()
    await DeviceTokenModel.syncIndexes()
  }

  async findByUser(
    scope: NotificationUserScope,
    limit = DEFAULT_LIMIT
  ): Promise<NotificationEntity[]> {
    const docs = await NotificationModel.find({ userId: scope.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return docs.map((doc) => ({
      id: doc._id.toString(),
      userId: doc.userId,
      title: doc.title,
      body: doc.body,
      type: doc.type,
      read: doc.read,
      actionUrl: doc.actionUrl,
      createdAt: doc.createdAt,
    }))
  }

  async countUnread(scope: NotificationUserScope): Promise<number> {
    return NotificationModel.countDocuments({
      userId: scope.userId,
      read: false,
    })
  }

  async findTokensByUserId(userId: string): Promise<DeviceTokenEntity[]> {
    const docs = await DeviceTokenModel.find({ userId }).lean()

    return docs.map((doc) => ({
      id: doc._id.toString(),
      userId: doc.userId,
      token: doc.token,
      platform: doc.platform,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }))
  }

  async findTokensByUserIds(userIds: string[]): Promise<DeviceTokenEntity[]> {
    if (userIds.length === 0) return []

    const docs = await DeviceTokenModel.find({
      userId: { $in: userIds },
    }).lean()

    return docs.map((doc) => ({
      id: doc._id.toString(),
      userId: doc.userId,
      token: doc.token,
      platform: doc.platform,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }))
  }
}
