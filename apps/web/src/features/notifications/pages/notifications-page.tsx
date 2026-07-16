import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui-shadcn/components/alert"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui-shadcn/components/empty"
import { Skeleton } from "@workspace/ui-shadcn/components/skeleton"
import { BellIcon, CheckCheckIcon, CircleAlertIcon } from "lucide-react"
import { NotificationList } from "@/features/notifications/components/notification-list"
import {
  useDeleteNotificationMutation,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/features/notifications/hooks/use-notifications"

export function NotificationsPage() {
  const { data, isLoading, isError, error } = useNotificationsQuery()
  const markRead = useMarkNotificationReadMutation()
  const markAllRead = useMarkAllNotificationsReadMutation()
  const deleteNotification = useDeleteNotificationMutation()

  const notifications = data?.items ?? []
  const totalUnread = data?.totalUnread ?? 0
  const isMutating =
    markRead.isPending || markAllRead.isPending || deleteNotification.isPending

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
          {totalUnread > 0 ? (
            <p className="text-muted-foreground">
              {totalUnread} unread notification{totalUnread !== 1 ? "s" : ""}
            </p>
          ) : (
            <p className="text-muted-foreground">You&apos;re all caught up.</p>
          )}
        </div>
        {totalUnread > 0 ? (
          <Button
            disabled={isMutating}
            onClick={() => markAllRead.mutate()}
            variant="outline"
          >
            <CheckCheckIcon data-icon="inline-start" />
            Mark all as read
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="overflow-hidden rounded-lg border">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="flex items-start gap-3 border-b px-4 py-3 last:border-b-0"
                key={index}
              >
                <Skeleton className="mt-1.5 size-2 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-full max-w-sm" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {isError ? (
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>Could not load notifications</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Something went wrong."}
            </AlertDescription>
          </Alert>
        ) : null}

        {!isLoading && !isError && notifications.length === 0 ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BellIcon />
              </EmptyMedia>
              <EmptyTitle>No notifications</EmptyTitle>
              <EmptyDescription>
                When something important happens, you&apos;ll see it here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {!isLoading && !isError && notifications.length > 0 ? (
          <NotificationList
            disabled={isMutating}
            notifications={notifications}
            onDelete={(id) => deleteNotification.mutate(id)}
            onMarkRead={(id) => markRead.mutate(id)}
          />
        ) : null}
      </div>
    </div>
  )
}
