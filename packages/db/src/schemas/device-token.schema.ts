import mongoose, { Schema, type Document, type Types } from "mongoose"

export const PlatformEnum = ["ios", "android", "web"] as const
export type PlatformType = (typeof PlatformEnum)[number]

export interface IDeviceToken extends Document {
  _id: Types.ObjectId
  userId: string
  token: string
  platform: PlatformType
  createdAt: Date
  updatedAt: Date
}

export const DeviceTokenSchema = new Schema<IDeviceToken>({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  platform: { type: String, enum: PlatformEnum, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
})

// Indexes mapped from old query repository
DeviceTokenSchema.index({ userId: 1, token: 1 }, { unique: true })
DeviceTokenSchema.index({ token: 1 }, { unique: true })
DeviceTokenSchema.index({ userId: 1 })

export const DeviceTokenModel = mongoose.models.DeviceToken
  ? mongoose.model<IDeviceToken>("DeviceToken")
  : mongoose.model<IDeviceToken>(
      "DeviceToken",
      DeviceTokenSchema,
      "deviceTokens"
    )
