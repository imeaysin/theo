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
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@workspace/ui-shadcn/components/item"
import { Skeleton } from "@workspace/ui-shadcn/components/skeleton"
import { BellIcon, CheckCheckIcon, CircleAlertIcon } from "lucide-react"
import { PageHeader } from "@/components/page-header"
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
      <PageHeader
        actions={
          totalUnread > 0 ? (
            <Button
              disabled={isMutating}
              onClick={() => markAllRead.mutate()}
              variant="outline"
            >
              <CheckCheckIcon data-icon="inline-start" />
              Mark all as read
            </Button>
          ) : null
        }
        description={
          totalUnread > 0
            ? `${totalUnread} unread notification${totalUnread !== 1 ? "s" : ""}`
            : "You're all caught up."
        }
        title="Notifications"
      />

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <ItemGroup>
            {Array.from({ length: 4 }).map((_, index) => (
              <Item key={index} variant="outline">
                <ItemMedia>
                  <Skeleton className="size-2 rounded-full" />
                </ItemMedia>
                <ItemContent>
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-full max-w-sm" />
                  <Skeleton className="h-3 w-20" />
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
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
