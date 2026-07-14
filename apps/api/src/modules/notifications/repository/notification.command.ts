import { Injectable } from "@nestjs/common"
import { isValidObjectId } from "mongoose"
import { NotificationModel, DeviceTokenModel } from "@workspace/db"
import type {
  NewNotificationEntity,
  NotificationEntity,
  NotificationMutationScope,
  NotificationUserScope,
  NewDeviceTokenEntity,
  DeviceTokenEntity,
} from "../domain/notification.model"

@Injectable()
export class NotificationCommandRepository {
  async insert(data: NewNotificationEntity): Promise<NotificationEntity> {
    const doc = await NotificationModel.create({
      userId: data.userId,
      title: data.title,
      body: data.body,
      type: data.type,
      read: false,
      actionUrl: data.actionUrl,
    })

    return {
      id: doc._id.toString(),
      userId: doc.userId,
      title: doc.title,
      body: doc.body,
      type: doc.type,
      read: doc.read,
      actionUrl: doc.actionUrl,
      createdAt: doc.createdAt,
    }
  }

  async insertMany(items: NewNotificationEntity[]): Promise<number> {
    if (items.length === 0) return 0

    const docs = items.map((data) => ({
      userId: data.userId,
      title: data.title,
      body: data.body,
      type: data.type,
      read: false,
      actionUrl: data.actionUrl,
    }))

    const result = await NotificationModel.insertMany(docs)

    return result.length
  }

  async markAsRead(scope: NotificationMutationScope): Promise<boolean> {
    if (!isValidObjectId(scope.notificationId)) return false

    const result = await NotificationModel.updateOne(
      { _id: scope.notificationId, userId: scope.userId },
      { $set: { read: true } }
    )

    return result.modifiedCount > 0 || result.matchedCount > 0
  }

  async markAllAsRead(scope: NotificationUserScope): Promise<number> {
    const result = await NotificationModel.updateMany(
      { userId: scope.userId, read: false },
      { $set: { read: true } }
    )

    return result.modifiedCount
  }

  async delete(scope: NotificationMutationScope): Promise<boolean> {
    if (!isValidObjectId(scope.notificationId)) return false

    const result = await NotificationModel.deleteOne({
      _id: scope.notificationId,
      userId: scope.userId,
    })

    return result.deletedCount > 0
  }

  async upsertToken(data: NewDeviceTokenEntity): Promise<DeviceTokenEntity> {
    const now = new Date()

    const result = await DeviceTokenModel.findOneAndUpdate(
      { token: data.token },
      {
        $set: {
          userId: data.userId,
          platform: data.platform,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after", lean: true }
    )

    if (!result) {
      throw new Error("upsert returned null — concurrent delete race")
    }

    return {
      id: result._id.toString(),
      userId: result.userId,
      token: result.token,
      platform: result.platform,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }
  }

  async removeByToken(token: string): Promise<boolean> {
    const result = await DeviceTokenModel.deleteOne({ token })
    return result.deletedCount > 0
  }

  async removeByUserAndToken(userId: string, token: string): Promise<boolean> {
    const result = await DeviceTokenModel.deleteOne({ userId, token })
    return result.deletedCount > 0
  }

  async removeManyByTokens(tokens: string[]): Promise<number> {
    if (tokens.length === 0) return 0

    const result = await DeviceTokenModel.deleteMany({ token: { $in: tokens } })
    return result.deletedCount
  }
}
