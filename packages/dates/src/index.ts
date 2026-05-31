import { format, parseISO, isValid, formatDistanceToNow } from "date-fns"

/**
 * Standard date formatting options.
 */
export const DATE_FORMATS = {
  FULL: "PPP",
  SHORT: "P",
  DATETIME: "PPPp",
  ISO: "yyyy-MM-dd",
} as const

/**
 * Formats a date string or Date object using a specified pattern.
 */
export function formatDate(
  date: Date | string | number,
  pattern: string = DATE_FORMATS.FULL
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date)

  if (!isValid(dateObj)) return "Invalid Date"

  return format(dateObj, pattern)
}

/**
 * Returns a human-readable relative time string (e.g., "3 days ago").
 */
export function relativeTime(date: Date | string | number): string {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date)

  if (!isValid(dateObj)) return "Invalid Date"

  return formatDistanceToNow(dateObj, { addSuffix: true })
}

/**
 * Re-export useful functions from date-fns
 */
export { isValid, parseISO } from "date-fns"
