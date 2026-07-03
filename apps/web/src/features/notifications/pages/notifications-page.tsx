import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import {
  ShellMain,
  shellPageStackClassName,
} from "@workspace/ui/components/shell"
import { Skeleton } from "@workspace/ui/components/skeleton"
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
    <ShellMain
      header={{
        heading: "Notifications",
        subtitle:
          totalUnread > 0
            ? `You have ${totalUnread} unread notification${totalUnread === 1 ? "" : "s"}.`
            : "You're all caught up.",
        cta:
          totalUnread > 0 ? (
            <Button
              disabled={isMutating}
              onClick={() => markAllRead.mutate()}
              variant="outline"
            >
              <CheckCheckIcon className="size-4" />
              Mark all as read
            </Button>
          ) : undefined,
      }}
    >
      <div className={shellPageStackClassName}>
        {isLoading ? (
          <div className="overflow-hidden rounded-lg border">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="flex items-start gap-3 border-b px-4 py-3 last:border-b-0"
                key={index}
              >
                <Skeleton className="mt-1.5 size-2 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-full max-w-sm" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {isError ? (
          <Alert variant="error">
            <CircleAlertIcon />
            <AlertTitle>Could not load notifications</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Something went wrong."}
            </AlertDescription>
          </Alert>
        ) : null}

        {!isLoading && !isError && notifications.length === 0 ? (
          <Empty className="rounded-lg border border-dashed">
            <EmptyContent>
              <EmptyMedia variant="icon">
                <BellIcon />
              </EmptyMedia>
              <EmptyTitle>No notifications</EmptyTitle>
              <EmptyDescription>
                When something important happens, you&apos;ll see it here.
              </EmptyDescription>
            </EmptyContent>
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
    </ShellMain>
  )
}
