export type NotificationEntity = {
  id: string
  userId: string
  title: string
  body: string
  type: string
  read: boolean
  actionUrl?: string
  createdAt: Date
}

export type NewNotificationEntity = Pick<
  NotificationEntity,
  "userId" | "title" | "body" | "type" | "actionUrl"
>

export type DeviceTokenEntity = {
  id: string
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

export type NotificationUserScope = {
  userId: string
}

export type NotificationMutationScope = NotificationUserScope & {
  notificationId: string
}
