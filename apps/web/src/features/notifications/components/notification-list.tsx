import type { NotificationResponse } from "@workspace/contracts"
import { dates } from "@/lib/dates"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui-shadcn/components/item"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui-shadcn/components/tooltip"
import { cn } from "@workspace/ui-shadcn/lib/utils"
import { CheckIcon, ExternalLinkIcon, Trash2Icon } from "lucide-react"
import { Link } from "react-router-dom"

type NotificationItemProps = {
  notification: NotificationResponse
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
  disabled?: boolean
}

function NotificationListItem({
  notification,
  onMarkRead,
  onDelete,
  disabled,
}: NotificationItemProps) {
  return (
    <Item role="listitem" variant={notification.read ? "outline" : "muted"}>
      <ItemMedia>
        <span
          aria-hidden
          className={cn(
            "size-2 shrink-0 rounded-full",
            notification.read ? "bg-transparent" : "bg-primary"
          )}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{notification.title}</ItemTitle>
        {notification.body ? (
          <ItemDescription>{notification.body}</ItemDescription>
        ) : null}
        <ItemDescription className="flex flex-wrap items-center gap-2">
          <time>{dates.relativeTime(notification.createdAt)}</time>
          {notification.actionUrl ? (
            <Link
              className="inline-flex items-center gap-1 text-primary hover:underline"
              to={notification.actionUrl}
            >
              View
              <ExternalLinkIcon className="size-3.5" />
            </Link>
          ) : null}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        {!notification.read ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label="Mark as read"
                  disabled={disabled}
                  onClick={() => onMarkRead(notification.id)}
                  size="icon-sm"
                  variant="outline"
                />
              }
            >
              <CheckIcon />
            </TooltipTrigger>
            <TooltipContent>Mark as read</TooltipContent>
          </Tooltip>
        ) : null}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Delete notification"
                disabled={disabled}
                onClick={() => onDelete(notification.id)}
                size="icon-sm"
                variant="outline"
              />
            }
          >
            <Trash2Icon />
          </TooltipTrigger>
          <TooltipContent>Delete notification</TooltipContent>
        </Tooltip>
      </ItemActions>
    </Item>
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
    <ItemGroup>
      {notifications.map((notification) => (
        <NotificationListItem
          disabled={disabled}
          key={notification.id}
          notification={notification}
          onDelete={onDelete}
          onMarkRead={onMarkRead}
        />
      ))}
    </ItemGroup>
  )
}
