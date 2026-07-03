import type { ObjectId } from "mongodb"

export type DeviceTokenEntity = {
  _id: ObjectId
  userId: string
  token: string
  platform: "ios" | "android" | "web"
  createdAt: Date
  updatedAt: Date
}

export type NewDeviceTokenEntity = Pick<
  DeviceTokenEntity,
  "userId" | "token" | "platform"
>
