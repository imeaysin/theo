export type NotificationUserScope = {
  userId: string
}

export type NotificationMutationScope = NotificationUserScope & {
  notificationId: string
}
