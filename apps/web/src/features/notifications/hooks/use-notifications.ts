import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  NotificationListResponseSchema,
  UnreadCountResponseSchema,
  type NotificationListResponse,
  type NotificationResponse,
  type UnreadCountResponse,
} from "@workspace/contracts"
import { toastManager } from "@workspace/ui/components/toast"
import { apiRoutes } from "@/config/api-routes"
import { apiFetch } from "@/lib/api"

export const notificationsQueryKey = ["notifications"] as const
export const unreadCountQueryKey = ["notifications", "unread-count"] as const

type PatchNotificationsOptions = {
  queryClient: ReturnType<typeof useQueryClient>
  updater: (items: NotificationResponse[]) => NotificationResponse[]
}

function patchNotificationsList({
  queryClient,
  updater,
}: PatchNotificationsOptions) {
  queryClient.setQueryData<NotificationListResponse>(
    notificationsQueryKey,
    (current) => {
      if (!current) return current
      const items = updater(current.items)
      const totalUnread = items.filter((n) => !n.read).length
      return { items, totalUnread }
    }
  )
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationsQueryKey,
    queryFn: async () => {
      const data = await apiFetch<unknown>(apiRoutes.notifications)
      return NotificationListResponseSchema.parse(data)
    },
  })
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: unreadCountQueryKey,
    queryFn: async () => {
      const data = await apiFetch<unknown>(apiRoutes.notificationUnreadCount)
      return UnreadCountResponseSchema.parse(data)
    },
    refetchInterval: 60_000,
  })
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) =>
      apiFetch<void>(apiRoutes.notificationMarkRead(notificationId), {
        method: "POST",
      }),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey })
      patchNotificationsList({
        queryClient,
        updater: (items) =>
          items.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
      })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKey })
      void queryClient.invalidateQueries({ queryKey: unreadCountQueryKey })
    },
  })
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiFetch<void>(apiRoutes.notificationMarkAllRead, { method: "POST" }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey })
      patchNotificationsList({
        queryClient,
        updater: (items) => items.map((n) => ({ ...n, read: true })),
      })
      queryClient.setQueryData<UnreadCountResponse>(unreadCountQueryKey, {
        count: 0,
      })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKey })
      void queryClient.invalidateQueries({ queryKey: unreadCountQueryKey })
    },
  })
}

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) =>
      toastManager.promise(
        apiFetch<void>(apiRoutes.notification(notificationId), {
          method: "DELETE",
        }),
        {
          error: {
            title: "Could not delete notification",
            description: "Please try again.",
            type: "error",
          },
          loading: {
            title: "Deleting notification…",
            type: "loading",
          },
          success: {
            title: "Notification deleted",
            type: "success",
          },
        }
      ),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey })
      patchNotificationsList({
        queryClient,
        updater: (items) => items.filter((n) => n.id !== notificationId),
      })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKey })
      void queryClient.invalidateQueries({ queryKey: unreadCountQueryKey })
    },
  })
}
