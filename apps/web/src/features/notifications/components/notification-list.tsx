"use client"

import type { NotificationResponse } from "@workspace/contracts"
import type { ColumnDef } from "@tanstack/react-table"
import { dates } from "@/lib/dates"
import { Button } from "@workspace/ui-shadcn/components/button"
import { Badge } from "@workspace/ui-shadcn/components/badge"
import { DataTable } from "@workspace/ui-shadcn/components/data-table"
import { DataTableColumnHeader } from "@workspace/ui-shadcn/components/data-table-column-header"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui-shadcn/components/tooltip"
import { CheckIcon, ExternalLinkIcon, Trash2Icon } from "lucide-react"
import { useMemo } from "react"
import { Link } from "react-router-dom"

type NotificationListProps = {
  notifications: NotificationResponse[]
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
  disabled?: boolean
}

function matchesNotificationSearch(
  notification: NotificationResponse,
  query: string
) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  return (
    notification.title.toLowerCase().includes(normalized) ||
    (notification.body?.toLowerCase().includes(normalized) ?? false)
  )
}

function getNotificationColumns({
  onMarkRead,
  onDelete,
  disabled,
}: Omit<
  NotificationListProps,
  "notifications"
>): ColumnDef<NotificationResponse>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Notification" />
      ),
      cell: ({ row }) => {
        const notification = row.original
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {!notification.read ? (
                <Badge variant="secondary">Unread</Badge>
              ) : null}
              <span className="font-medium">{notification.title}</span>
            </div>
            {notification.body ? (
              <p className="max-w-md truncate text-muted-foreground">
                {notification.body}
              </p>
            ) : null}
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="When" />
      ),
      cell: ({ row }) => (
        <time className="whitespace-nowrap text-muted-foreground">
          {dates.relativeTime(row.original.createdAt)}
        </time>
      ),
    },
    {
      id: "link",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        const actionUrl = row.original.actionUrl
        if (!actionUrl) return null
        return (
          <Link
            className="inline-flex items-center gap-1 text-primary hover:underline"
            to={actionUrl}
          >
            View
            <ExternalLinkIcon className="size-3.5" />
          </Link>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        const notification = row.original
        return (
          <div className="flex items-center justify-end gap-2">
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
          </div>
        )
      },
    },
  ]
}

export function NotificationList({
  notifications,
  onMarkRead,
  onDelete,
  disabled,
}: NotificationListProps) {
  const columns = useMemo(
    () => getNotificationColumns({ onMarkRead, onDelete, disabled }),
    [onMarkRead, onDelete, disabled]
  )

  return (
    <DataTable
      columns={columns}
      data={notifications}
      filterFn={matchesNotificationSearch}
      filterPlaceholder="Filter notifications..."
      getRowId={(notification) => notification.id}
      initialSorting={[{ id: "createdAt", desc: true }]}
    />
  )
}
