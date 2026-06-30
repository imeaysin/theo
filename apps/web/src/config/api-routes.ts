const API_VERSION = "v1"

function apiPath(path: string) {
  return `/${API_VERSION}/${path}`
}

/** NestJS API paths — for `apiFetch()` only. */
export const apiRoutes = {
  health: apiPath("health"),
  me: apiPath("me"),
  notes: apiPath("notes"),
  note: (id: string) => apiPath(`notes/${id}`),
  uploads: apiPath("uploads"),
} as const
