const API_VERSION = "v1"

function apiPath(path: string) {
  return `/${API_VERSION}/${path}`
}

/** NestJS API paths — for `apiFetch()` only. */
export const apiRoutes = {
  health: apiPath("health"),
  me: apiPath("me"),
  notes: apiPath("notes"),
  notesBulkDelete: apiPath("notes/bulk-delete"),
  note: (id: string) => apiPath(`notes/${id}`),
  uploads: apiPath("uploads"),
  notifications: apiPath("notifications"),
  notificationUnreadCount: apiPath("notifications/unread-count"),
  notificationMarkRead: (id: string) => apiPath(`notifications/${id}/read`),
  notificationMarkAllRead: apiPath("notifications/read-all"),
  notification: (id: string) => apiPath(`notifications/${id}`),
  eventsStream: apiPath("events/stream"),
} as const
