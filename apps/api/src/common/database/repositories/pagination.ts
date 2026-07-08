export type PaginationOptions = {
  page: number
  limit: number
}

export type PaginatedResult<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const PAGINATION_MAX_LIMIT = 200
export const PAGINATION_DEFAULT_LIMIT = 20

export function clampPagination(options: PaginationOptions): PaginationOptions {
  const page = Math.max(1, Math.floor(options.page))
  const rawLimit = Math.floor(options.limit)
  const limit =
    rawLimit <= 0
      ? PAGINATION_DEFAULT_LIMIT
      : Math.min(rawLimit, PAGINATION_MAX_LIMIT)
  return { page, limit }
}

export function toSkip(options: PaginationOptions): number {
  return (options.page - 1) * options.limit
}
