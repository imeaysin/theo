import type { NotificationResponse } from "@workspace/contracts"
import { dates } from "@/lib/dates"
import { Button } from "@workspace/ui/components/button"
import { TooltipHint } from "@workspace/ui/components/tooltip-hint"
import { cn } from "@workspace/ui/lib/utils"
import { CheckIcon, ExternalLinkIcon, Trash2Icon } from "lucide-react"
import { Link } from "react-router-dom"

type NotificationItemProps = {
  notification: NotificationResponse
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
  disabled?: boolean
}

function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  disabled,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "group flex items-start gap-3 border-b px-4 py-3 last:border-b-0",
        !notification.read && "bg-accent/30"
      )}
    >
      <div
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full",
          notification.read ? "bg-transparent" : "bg-primary"
        )}
        aria-hidden
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug font-medium">{notification.title}</p>
        {notification.body ? (
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
            {notification.body}
          </p>
        ) : null}
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <time>{dates.relativeTime(notification.createdAt)}</time>
          {notification.actionUrl ? (
            <Link
              className="inline-flex items-center gap-1 text-primary hover:underline"
              to={notification.actionUrl}
            >
              View
              <ExternalLinkIcon className="size-3" />
            </Link>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!notification.read ? (
          <TooltipHint content="Mark as read">
            <Button
              aria-label="Mark as read"
              disabled={disabled}
              onClick={() => onMarkRead(notification.id)}
              size="icon-sm"
              variant="ghost"
            >
              <CheckIcon className="size-3.5" />
            </Button>
          </TooltipHint>
        ) : null}
        <TooltipHint content="Delete notification">
          <Button
            aria-label="Delete notification"
            disabled={disabled}
            onClick={() => onDelete(notification.id)}
            size="icon-sm"
            variant="ghost"
          >
            <Trash2Icon className="size-3.5" />
          </Button>
        </TooltipHint>
      </div>
    </div>
  )
}

type NotificationListProps = {
  notifications: NotificationResponse[]
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
  disabled?: boolean
}

export function NotificationList({
  notifications,
  onMarkRead,
  onDelete,
  disabled,
}: NotificationListProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      {notifications.map((notification) => (
        <NotificationItem
          disabled={disabled}
          key={notification.id}
          notification={notification}
          onDelete={onDelete}
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  )
}
