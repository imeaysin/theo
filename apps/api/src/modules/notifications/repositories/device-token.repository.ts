import { Inject, Injectable, type OnModuleInit } from "@nestjs/common"
import type { Db } from "mongodb"
import { MONGO_DB } from "../../../common/database/database.module"
import type {
  DeviceTokenEntity,
  NewDeviceTokenEntity,
} from "../entities/device-token.entity"

const COLLECTION = "deviceTokens"

@Injectable()
export class DeviceTokenRepository implements OnModuleInit {
  constructor(@Inject(MONGO_DB) private readonly db: Db) {}

  async onModuleInit() {
    const col = this.db.collection(COLLECTION)
    await col.createIndex({ userId: 1, token: 1 }, { unique: true })
    await col.createIndex({ token: 1 }, { unique: true })
    await col.createIndex({ userId: 1 })
  }

  /**
   * Register a device token (upsert).
   * If the token already belongs to another user, it's reassigned —
   * a device can only be tied to one account at a time.
   */
  async upsert(data: NewDeviceTokenEntity): Promise<DeviceTokenEntity> {
    const now = new Date()
    const col = this.db.collection<DeviceTokenEntity>(COLLECTION)

    const result = await col.findOneAndUpdate(
      { token: data.token },
      {
        $set: {
          userId: data.userId,
          platform: data.platform,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after" }
    )

    return result!
  }

  async removeByToken(token: string): Promise<boolean> {
    const result = await this.db
      .collection<DeviceTokenEntity>(COLLECTION)
      .deleteOne({ token })

    return result.deletedCount > 0
  }

  async removeByUserAndToken(userId: string, token: string): Promise<boolean> {
    const result = await this.db
      .collection<DeviceTokenEntity>(COLLECTION)
      .deleteOne({ userId, token })

    return result.deletedCount > 0
  }

  /** Remove tokens reported as invalid by the push service. */
  async removeManyByTokens(tokens: string[]): Promise<number> {
    if (tokens.length === 0) return 0

    const result = await this.db
      .collection<DeviceTokenEntity>(COLLECTION)
      .deleteMany({ token: { $in: tokens } })

    return result.deletedCount
  }

  async findByUserId(userId: string): Promise<DeviceTokenEntity[]> {
    return this.db
      .collection<DeviceTokenEntity>(COLLECTION)
      .find({ userId })
      .toArray()
  }

  /** Fetch tokens for multiple users in a single query. */
  async findByUserIds(userIds: string[]): Promise<DeviceTokenEntity[]> {
    if (userIds.length === 0) return []

    return this.db
      .collection<DeviceTokenEntity>(COLLECTION)
      .find({ userId: { $in: userIds } })
      .toArray()
  }
}
